import { getFirebaseApp } from '../../../config/firebase';
import { Organization } from '../models/organization';

const COLLECTION = 'organizations';

export interface OrganizationFilters {
  search?: string; // Search by name, description, or email
  status?: 'active' | 'inactive';
}

export interface OrganizationSort {
  field: 'name' | 'createdAt' | 'email';
  direction: 'asc' | 'desc';
}

export interface PaginationOptions {
  limit?: number;
  offset?: number;
}

export class OrganizationsRepository {
  private get db() {
    return getFirebaseApp().firestore();
  }

  async create(data: Omit<Organization, 'id' | 'createdAt'>): Promise<Organization> {
    const ref = this.db.collection(COLLECTION).doc();
    const organization: Organization = {
      id: ref.id,
      createdAt: new Date().toISOString(),
      ...data
    };
    await ref.set(organization);
    return organization;
  }

  async findById(id: string): Promise<Organization | null> {
    const snap = await this.db.collection(COLLECTION).doc(id).get();
    if (!snap.exists) return null;
    return snap.data() as Organization;
  }

  async findAll(): Promise<Organization[]> {
    try {
      console.log('🔍 Fetching all organizations...');
      const snap = await this.db.collection(COLLECTION).get();
      console.log('✅ Found', snap.docs.length, 'organizations');
      return snap.docs.map((d) => d.data() as Organization);
    } catch (error) {
      console.error('❌ Error fetching organizations:', error);
      throw error;
    }
  }

  /**
   * Advanced query with filtering, sorting, and pagination
   */
  async findWithFilters(
    filters: OrganizationFilters = {},
    sort?: OrganizationSort,
    pagination?: PaginationOptions
  ): Promise<{ data: Organization[]; total: number }> {
    try {
      console.log('🔍 Fetching organizations with filters:', { filters, sort, pagination });

      // Get all organizations first
      const snap = await this.db.collection(COLLECTION).get();
      let organizations = snap.docs.map((d) => d.data() as Organization);

      console.log(`📦 Fetched ${organizations.length} organizations from Firestore`);

      // Apply filters in memory
      if (filters.status) {
        organizations = organizations.filter((o) => o.status === filters.status);
      }

      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        organizations = organizations.filter(
          (o) =>
            o.name.toLowerCase().includes(searchLower) ||
            o.description?.toLowerCase().includes(searchLower) ||
            o.email?.toLowerCase().includes(searchLower)
        );
      }

      const total = organizations.length;

      if (sort) {
        organizations.sort((a: Organization, b: Organization) => {
          let aVal = a[sort.field];
          let bVal = b[sort.field];

          if (aVal === undefined) aVal = '';
          if (bVal === undefined) bVal = '';

          const aStr = String(aVal).toLowerCase();
          const bStr = String(bVal).toLowerCase();

          if (sort.direction === 'asc') {
            return aStr.localeCompare(bStr);
          } else {
            return bStr.localeCompare(aStr);
          }
        });
      } else {
        organizations.sort((a, b) => {
          const aDate = new Date(a.createdAt || 0).getTime();
          const bDate = new Date(b.createdAt || 0).getTime();
          return bDate - aDate;
        });
      }

      if (pagination) {
        const start = pagination.offset || 0;
        const end = start + (pagination.limit || organizations.length);
        organizations = organizations.slice(start, end);
      }

      console.log(`✅ Returning ${organizations.length} organizations (total: ${total})`);

      return {
        data: organizations,
        total
      };
    } catch (error) {
      console.error('❌ Error fetching organizations with filters:', error);
      throw error;
    }
  }

  async update(id: string, patch: Partial<Organization>): Promise<Organization | null> {
    const ref = this.db.collection(COLLECTION).doc(id);
    const snap = await ref.get();
    if (!snap.exists) return null;

    const existing = snap.data() as Organization;
    const updated: Organization = {
      ...existing,
      ...patch,
      updatedAt: new Date().toISOString()
    };

    await ref.set(updated);
    return updated;
  }

  async remove(id: string): Promise<void> {
    await this.db.collection(COLLECTION).doc(id).delete();
  }
}
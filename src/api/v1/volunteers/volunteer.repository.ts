import { getFirebaseApp } from '../../../config/firebase';
import { Volunteer, VolunteerStatus } from '../models/volunteer';

const COLLECTION = 'volunteers';

export interface VolunteerFilters {
  organizationId?: string;
  status?: VolunteerStatus;
  skills?: string[];
  search?: string;
}

export interface VolunteerSort {
  field: 'firstName' | 'lastName' | 'createdAt' | 'email';
  direction: 'asc' | 'desc';
}

export interface PaginationOptions {
  limit?: number;
  offset?: number;
}

export class VolunteerRepository {
  private get db() {
    return getFirebaseApp().firestore();
  }

  async create(
    data: Omit<Volunteer, 'id' | 'createdAt'>
  ): Promise<Volunteer> {
    const ref = this.db.collection(COLLECTION).doc();
    const volunteer: Volunteer = {
      id: ref.id,
      createdAt: new Date().toISOString(),
      ...data
    };
    await ref.set(volunteer);
    return volunteer;
  }

  async findById(id: string): Promise<Volunteer | null> {
    const snap = await this.db.collection(COLLECTION).doc(id).get();
    if (!snap.exists) return null;
    return snap.data() as Volunteer;
  }

  async findAll(): Promise<Volunteer[]> {
    try {
      console.log('🔍 Fetching all volunteers...');
      const snap = await this.db.collection(COLLECTION).get();
      console.log('✅ Found', snap.docs.length, 'volunteers');
      return snap.docs.map((d) => d.data() as Volunteer);
    } catch (error) {
      console.error('❌ Error fetching volunteers:', error);
      throw error;
    }
  }

  async findByOrganization(orgId: string): Promise<Volunteer[]> {
    const snap = await this.db
      .collection(COLLECTION)
      .where('organizationId', '==', orgId)
      .get();

    return snap.docs.map((d) => d.data() as Volunteer);
  }

async findWithFilters(
  filters: VolunteerFilters = {},
  sort?: VolunteerSort,
  pagination?: PaginationOptions
): Promise<{ data: Volunteer[]; total: number }> {
  try {
    console.log('🔍 Fetching volunteers with filters:', { filters, sort, pagination });

    let query: FirebaseFirestore.Query = this.db.collection(COLLECTION);
    let volunteers: Volunteer[] = [];

    if (filters.organizationId) {
      query = query.where('organizationId', '==', filters.organizationId);
    }

    const snap = await query.get();
    volunteers = snap.docs.map((d) => d.data() as Volunteer);

    console.log(`📦 Fetched ${volunteers.length} volunteers from Firestore`);

    if (filters.status) {
      volunteers = volunteers.filter((v) => v.status === filters.status);
    }

    if (filters.skills && filters.skills.length > 0) {
      volunteers = volunteers.filter((v) =>
        filters.skills!.every((skill) => v.skills?.includes(skill))
      );
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      volunteers = volunteers.filter(
        (v) =>
          v.firstName.toLowerCase().includes(searchLower) ||
          v.lastName.toLowerCase().includes(searchLower) ||
          v.email.toLowerCase().includes(searchLower)
      );
    }

    const total = volunteers.length;

    if (sort) {
      volunteers.sort((a, b) => {
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
      volunteers.sort((a, b) => {
        const aDate = new Date(a.createdAt || 0).getTime();
        const bDate = new Date(b.createdAt || 0).getTime();
        return bDate - aDate;
      });
    }

    if (pagination) {
      const start = pagination.offset || 0;
      const end = start + (pagination.limit || volunteers.length);
      volunteers = volunteers.slice(start, end);
    }

    console.log(`✅ Returning ${volunteers.length} volunteers (total: ${total})`);

    return {
      data: volunteers,
      total
    };
  } catch (error) {
    console.error('❌ Error fetching volunteers with filters:', error);
    throw error;
  }
}

  async update(
    id: string,
    patch: Partial<Volunteer>
  ): Promise<Volunteer | null> {
    const ref = this.db.collection(COLLECTION).doc(id);
    const snap = await ref.get();
    if (!snap.exists) return null;

    const existing = snap.data() as Volunteer;
    const updated: Volunteer = {
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
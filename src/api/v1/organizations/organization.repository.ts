import { getFirestore, FieldValue, Timestamp } from '../../config/firebase';
import { Organization, CreateOrganizationDTO, UpdateOrganizationDTO } from './organization.types';
import { logger } from '../../api/utils/logger';

const COLLECTION_NAME = 'organizations';

export class OrganizationRepository {
  private db = getFirestore();
  private collection = this.db.collection(COLLECTION_NAME);

  async create(data: CreateOrganizationDTO): Promise<Organization> {
    try {
      const docRef = this.collection.doc();
      const now = FieldValue.serverTimestamp();

      const organizationData = {
        ...data,
        digestEnabled: data.digestEnabled ?? true,
        createdAt: now,
        updatedAt: now,
      };

      await docRef.set(organizationData);

      logger.info('Organization created', { id: docRef.id, name: data.name });

      const doc = await docRef.get();
      return this.mapToOrganization(docRef.id, doc.data()!);
    } catch (error) {
      logger.error('Error creating organization:', error);
      throw error;
    }
  }

  async findById(id: string): Promise<Organization | null> {
    try {
      const doc = await this.collection.doc(id).get();

      if (!doc.exists) {
        return null;
      }

      return this.mapToOrganization(doc.id, doc.data()!);
    } catch (error) {
      logger.error('Error finding organization by ID:', error);
      throw error;
    }
  }

  async findBySlug(slug: string): Promise<Organization | null> {
    try {
      const snapshot = await this.collection.where('slug', '==', slug).limit(1).get();

      if (snapshot.empty) {
        return null;
      }

      const doc = snapshot.docs[0];
      return this.mapToOrganization(doc.id, doc.data());
    } catch (error) {
      logger.error('Error finding organization by slug:', error);
      throw error;
    }
  }

  async update(id: string, data: UpdateOrganizationDTO): Promise<Organization> {
    try {
      const docRef = this.collection.doc(id);
      
      const updateData = {
        ...data,
        updatedAt: FieldValue.serverTimestamp(),
      };

      await docRef.update(updateData);

      logger.info('Organization updated', { id, updates: Object.keys(data) });

      const doc = await docRef.get();
      return this.mapToOrganization(doc.id, doc.data()!);
    } catch (error) {
      logger.error('Error updating organization:', error);
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await this.collection.doc(id).delete();
      logger.info('Organization deleted', { id });
    } catch (error) {
      logger.error('Error deleting organization:', error);
      throw error;
    }
  }

  async exists(id: string): Promise<boolean> {
    try {
      const doc = await this.collection.doc(id).get();
      return doc.exists;
    } catch (error) {
      logger.error('Error checking organization existence:', error);
      throw error;
    }
  }

  async isSlugTaken(slug: string, excludeId?: string): Promise<boolean> {
    try {
      const snapshot = await this.collection.where('slug', '==', slug).get();

      if (snapshot.empty) {
        return false;
      }

      if (excludeId) {
        return snapshot.docs.some((doc) => doc.id !== excludeId);
      }

      return true;
    } catch (error) {
      logger.error('Error checking slug availability:', error);
      throw error;
    }
  }

  private mapToOrganization(id: string, data: FirebaseFirestore.DocumentData): Organization {
    return {
      id,
      name: data.name,
      slug: data.slug,
      description: data.description,
      address: data.address,
      contactEmail: data.contactEmail,
      contactPhone: data.contactPhone,
      website: data.website,
      digestEnabled: data.digestEnabled ?? true,
      createdAt: this.toDate(data.createdAt),
      updatedAt: this.toDate(data.updatedAt),
    };
  }

  private toDate(timestamp: FirebaseFirestore.Timestamp | undefined): Date {
    if (!timestamp) {
      return new Date();
    }
    return (timestamp as any).toDate();
  }
}
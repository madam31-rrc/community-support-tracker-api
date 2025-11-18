import { getFirebaseApp } from '../../../config/firebase';
import { Organization } from '../models/organization';

const COLLECTION = 'organizations';

export class OrganizationRepository {
  private get db() {
    return getFirebaseApp().firestore();
  }

  async create(data: Omit<Organization, 'id' | 'createdAt'>): Promise<Organization> {
    const docRef = this.db.collection(COLLECTION).doc();
    const org: Organization = {
      id: docRef.id,
      createdAt: new Date().toISOString(),
      ...data
    };
    await docRef.set(org);
    return org;
  }

  async findById(id: string): Promise<Organization | null> {
    const snap = await this.db.collection(COLLECTION).doc(id).get();
    if (!snap.exists) return null;
    return snap.data() as Organization;
  }

  async findAll(): Promise<Organization[]> {
    const snapshot = await this.db.collection(COLLECTION).get();
    return snapshot.docs.map((d) => d.data() as Organization);
  }

  async update(
    id: string,
    patch: Partial<Organization>
  ): Promise<Organization | null> {
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

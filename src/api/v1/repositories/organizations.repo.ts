import { getFirebase } from '../../../config/firebase';
import { Organization } from '../models/organization';

const COLLECTION = 'organizations';

export class OrganizationsRepo {
  async create(data: Omit<Organization, 'id' | 'createdAt'>): Promise<Organization> {
    const db = getFirebase().firestore();
    const doc = db.collection(COLLECTION).doc();
    const org: Organization = { id: doc.id, createdAt: new Date().toISOString(), ...data };
    await doc.set(org);
    return org;
  }
  async getById(id: string): Promise<Organization | null> {
    const snap = await getFirebase().firestore().collection(COLLECTION).doc(id).get();
    return snap.exists ? (snap.data() as Organization) : null;
  }
  async list(): Promise<Organization[]> {
    const qs = await getFirebase().firestore().collection(COLLECTION).get();
    return qs.docs.map((d) => d.data() as Organization);
  }
  async update(id: string, patch: Partial<Organization>): Promise<Organization | null> {
    const ref = getFirebase().firestore().collection(COLLECTION).doc(id);
    const snap = await ref.get();
    if (!snap.exists) return null;
    const updated = { ...(snap.data() as Organization), ...patch, updatedAt: new Date().toISOString() };
    await ref.set(updated);
    return updated;
  }
  async remove(id: string): Promise<boolean> {
    await getFirebase().firestore().collection(COLLECTION).doc(id).delete();
    return true;
  }
}

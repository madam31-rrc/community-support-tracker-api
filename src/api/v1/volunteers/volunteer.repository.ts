import { getFirebaseApp } from '../../../config/firebase';
import { Volunteer } from '../models/volunteer';

const COLLECTION = 'volunteers';

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

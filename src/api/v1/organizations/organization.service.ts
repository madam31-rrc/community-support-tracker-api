import { Organization } from '../models/organization';
import { OrganizationRepository } from './organization.repository';

export class OrganizationService {
  constructor(private repo = new OrganizationRepository()) {}

  async create(input: { name: string; slug?: string }): Promise<Organization> {
    return this.repo.create(input);
  }

  async getById(id: string): Promise<Organization | null> {
    return this.repo.findById(id);
  }

  async list(): Promise<Organization[]> {
    return this.repo.findAll();
  }

  async update(
    id: string,
    patch: Partial<Organization>
  ): Promise<Organization | null> {
    return this.repo.update(id, patch);
  }

  async delete(id: string): Promise<void> {
    await this.repo.remove(id);
  }
}

import { Organization } from '../models/organization';
import {
  OrganizationsRepository,
  OrganizationFilters,
  OrganizationSort,
  PaginationOptions
} from '../organizations/organization.repository';

export class OrganizationService {
  constructor(private repo = new OrganizationsRepository()) {}

  async create(input: Omit<Organization, 'id' | 'createdAt'>): Promise<Organization> {
    return this.repo.create(input);
  }

  async getById(id: string): Promise<Organization | null> {
    return this.repo.findById(id);
  }

  async list(): Promise<Organization[]> {
    return this.repo.findAll();
  }

  
  async listWithFilters(
    filters: OrganizationFilters = {},
    sort?: OrganizationSort,
    pagination?: PaginationOptions
  ): Promise<{ data: Organization[]; total: number; page?: number; limit?: number }> {
    const result = await this.repo.findWithFilters(filters, sort, pagination);

    return {
      ...result,
      page: pagination?.offset ? Math.floor(pagination.offset / (pagination.limit || 10)) + 1 : 1,
      limit: pagination?.limit
    };
  }

  async update(id: string, patch: Partial<Organization>): Promise<Organization | null> {
    return this.repo.update(id, patch);
  }

  async delete(id: string): Promise<void> {
    await this.repo.remove(id);
  }
}
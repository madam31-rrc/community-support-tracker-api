import { Volunteer, VolunteerStatus } from '../models/volunteer';
import {
  VolunteerRepository,
  VolunteerFilters,
  VolunteerSort,
  PaginationOptions
} from './volunteer.repository';

export class VolunteerService {
  constructor(private repo = new VolunteerRepository()) {}

  async create(input: {
    organizationId: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    skills?: string[];
    status?: VolunteerStatus;
  }): Promise<Volunteer> {
    const data: Omit<Volunteer, 'id' | 'createdAt'> = {
      organizationId: input.organizationId,
      firstName: input.firstName,
      lastName: input.lastName,
      email: input.email,
      phone: input.phone,
      skills: input.skills ?? [],
      status: input.status ?? 'active'
    };

    return this.repo.create(data);
  }

  async getById(id: string): Promise<Volunteer | null> {
    return this.repo.findById(id);
  }

  async list(orgId?: string): Promise<Volunteer[]> {
    if (orgId) {
      return this.repo.findByOrganization(orgId);
    }
    return this.repo.findAll();
  }

  async listWithFilters(
    filters: VolunteerFilters = {},
    sort?: VolunteerSort,
    pagination?: PaginationOptions
  ): Promise<{ data: Volunteer[]; total: number; page?: number; limit?: number }> {
    const result = await this.repo.findWithFilters(filters, sort, pagination);

    return {
      ...result,
      page: pagination?.offset ? Math.floor(pagination.offset / (pagination.limit || 10)) + 1 : 1,
      limit: pagination?.limit
    };
  }

  async update(
    id: string,
    patch: Partial<Volunteer>
  ): Promise<Volunteer | null> {
    return this.repo.update(id, patch);
  }

  async delete(id: string): Promise<void> {
    await this.repo.remove(id);
  }
}
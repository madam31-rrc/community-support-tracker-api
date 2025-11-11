import { OrganizationRepository } from './organization.repository';
import {
  Organization,
  CreateOrganizationDTO,
  UpdateOrganizationDTO,
  OrganizationSummary,
} from './organization.types';
import { UserClaims, UserRole } from '../../../api/types/auth.types';
import {
  NotFoundError,
  ForbiddenError,
  ConflictError,
  BadRequestError,
} from '../../../api/utils/errors';
import { logger } from '../..api/utils/logger';
import { getFirestore } from '../../config/firebase';

export class OrganizationService {
  private repository = new OrganizationRepository();
  private db = getFirestore();

  async createOrganization(
    data: CreateOrganizationDTO,
    user: UserClaims
  ): Promise<Organization> {
    if (user.role !== UserRole.ADMIN) {
      throw new ForbiddenError('Only admins can create organizations');
    }
    const existingOrg = await this.repository.findBySlug(data.slug);
    if (existingOrg) {
      throw new ConflictError(`Organization with slug '${data.slug}' already exists`);
    }

    const organization = await this.repository.create(data);

    logger.info('Organization created successfully', {
      id: organization.id,
      name: organization.name,
      createdBy: user.uid,
    });

    return organization;
  }

  async getOrganizationById(id: string, user: UserClaims): Promise<Organization> {
    if (user.orgId !== id) {
      throw new ForbiddenError('Access denied to this organization');
    }

    const organization = await this.repository.findById(id);

    if (!organization) {
      throw new NotFoundError('Organization');
    }

    return organization;
  }

  async updateOrganization(
    id: string,
    data: UpdateOrganizationDTO,
    user: UserClaims
  ): Promise<Organization> {
    if (user.orgId !== id) {
      throw new ForbiddenError('Access denied to this organization');
    }

    if (![UserRole.ADMIN, UserRole.MANAGER].includes(user.role)) {
      throw new ForbiddenError('Only admins and managers can update organizations');
    }
    const exists = await this.repository.exists(id);
    if (!exists) {
      throw new NotFoundError('Organization');
    }

    if (data.slug) {
      const isTaken = await this.repository.isSlugTaken(data.slug, id);
      if (isTaken) {
        throw new ConflictError(`Slug '${data.slug}' is already taken`);
      }
    }

    const organization = await this.repository.update(id, data);

    logger.info('Organization updated successfully', {
      id,
      updatedBy: user.uid,
      updates: Object.keys(data),
    });

    return organization;
  }

  async getOrganizationSummary(id: string, user: UserClaims): Promise<OrganizationSummary> {
    if (user.orgId !== id) {
      throw new ForbiddenError('Access denied to this organization');
    }

    const organization = await this.repository.findById(id);
    if (!organization) {
      throw new NotFoundError('Organization');
    }

    const eventsSnapshot = await this.db
      .collection('events')
      .where('orgId', '==', id)
      .where('deletedAt', '==', null)
      .count()
      .get();
    const totalEvents = eventsSnapshot.data().count;

    const volunteersSnapshot = await this.db
      .collection('volunteers')
      .where('orgId', '==', id)
      .where('active', '==', true)
      .count()
      .get();
    const totalVolunteers = volunteersSnapshot.data().count;

    const donationsSnapshot = await this.db
      .collection('donations')
      .where('orgId', '==', id)
      .get();

    const totalDonations = donationsSnapshot.size;
    const totalDonationAmount = donationsSnapshot.docs.reduce(
      (sum, doc) => sum + (doc.data().amount || 0),
      0
    );

    return {
      id: organization.id,
      name: organization.name,
      totalEvents,
      totalVolunteers,
      totalDonations,
      totalDonationAmount,
    };
  }

  async deleteOrganization(id: string, user: UserClaims): Promise<void> {
    if (user.role !== UserRole.ADMIN) {
      throw new ForbiddenError('Only admins can delete organizations');
    }

    if (user.orgId !== id) {
      throw new ForbiddenError('Access denied to this organization');
    }

    const organization = await this.repository.findById(id);
    if (!organization) {
      throw new NotFoundError('Organization');
    }

    const summary = await this.getOrganizationSummary(id, user);
    if (summary.totalEvents > 0 || summary.totalVolunteers > 0 || summary.totalDonations > 0) {
      throw new BadRequestError(
        'Cannot delete organization with existing events, volunteers, or donations. Please delete all related data first.'
      );
    }

    await this.repository.delete(id);

    logger.warn('Organization deleted', {
      id,
      name: organization.name,
      deletedBy: user.uid,
    });
  }
}
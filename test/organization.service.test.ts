import { OrganizationService } from '../organization.service';
import { OrganizationRepository } from '../organization.repository';
import { UserRole } from '../../../api/types/auth.types';
import { ForbiddenError, NotFoundError, ConflictError } from '../../../api/utils/errors';

// Mock the repository
jest.mock('../organization.repository');
jest.mock('../../../config/firebase', () => ({
  getFirestore: jest.fn(() => ({
    collection: jest.fn(() => ({
      where: jest.fn(() => ({
        where: jest.fn(() => ({
          count: jest.fn(() => ({
            get: jest.fn(() => Promise.resolve({ data: () => ({ count: 0 }) })),
          })),
        })),
        count: jest.fn(() => ({
          get: jest.fn(() => Promise.resolve({ data: () => ({ count: 0 }) })),
        })),
        get: jest.fn(() => Promise.resolve({ size: 0, docs: [] })),
      })),
    })),
  })),
}));

describe('OrganizationService', () => {
  let service: OrganizationService;
  let mockRepository: jest.Mocked<OrganizationRepository>;

  const mockAdmin = {
    uid: 'admin123',
    email: 'admin@test.com',
    orgId: 'org123',
    role: UserRole.ADMIN,
  };

  const mockManager = {
    uid: 'manager123',
    email: 'manager@test.com',
    orgId: 'org123',
    role: UserRole.MANAGER,
  };

  const mockVolunteer = {
    uid: 'vol123',
    email: 'volunteer@test.com',
    orgId: 'org123',
    role: UserRole.VOLUNTEER,
  };

  const mockOrganization = {
    id: 'org123',
    name: 'Test Organization',
    slug: 'test-org',
    digestEnabled: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    service = new OrganizationService();
    mockRepository = OrganizationRepository.prototype as jest.Mocked<OrganizationRepository>;
  });

  describe('createOrganization', () => {
    const createData = {
      name: 'New Organization',
      slug: 'new-org',
      description: 'Test description',
    };

    it('should create organization when user is admin', async () => {
      mockRepository.findBySlug = jest.fn().mockResolvedValue(null);
      mockRepository.create = jest.fn().mockResolvedValue(mockOrganization);

      const result = await service.createOrganization(createData, mockAdmin);

      expect(mockRepository.findBySlug).toHaveBeenCalledWith('new-org');
      expect(mockRepository.create).toHaveBeenCalledWith(createData);
      expect(result).toEqual(mockOrganization);
    });

    it('should throw ForbiddenError when user is not admin', async () => {
      await expect(service.createOrganization(createData, mockManager)).rejects.toThrow(
        ForbiddenError
      );

      expect(mockRepository.create).not.toHaveBeenCalled();
    });

    it('should throw ConflictError when slug already exists', async () => {
      mockRepository.findBySlug = jest.fn().mockResolvedValue(mockOrganization);

      await expect(service.createOrganization(createData, mockAdmin)).rejects.toThrow(
        ConflictError
      );

      expect(mockRepository.create).not.toHaveBeenCalled();
    });
  });

  describe('getOrganizationById', () => {
    it('should return organization when user has access', async () => {
      mockRepository.findById = jest.fn().mockResolvedValue(mockOrganization);

      const result = await service.getOrganizationById('org123', mockAdmin);

      expect(mockRepository.findById).toHaveBeenCalledWith('org123');
      expect(result).toEqual(mockOrganization);
    });

    it('should throw ForbiddenError when user accesses different organization', async () => {
      const differentOrgUser = { ...mockAdmin, orgId: 'different-org' };

      await expect(service.getOrganizationById('org123', differentOrgUser)).rejects.toThrow(
        ForbiddenError
      );

      expect(mockRepository.findById).not.toHaveBeenCalled();
    });

    it('should throw NotFoundError when organization does not exist', async () => {
      mockRepository.findById = jest.fn().mockResolvedValue(null);

      await expect(service.getOrganizationById('org123', mockAdmin)).rejects.toThrow(
        NotFoundError
      );
    });
  });

  describe('updateOrganization', () => {
    const updateData = {
      name: 'Updated Organization',
      description: 'Updated description',
    };

    it('should update organization when user is admin', async () => {
      mockRepository.exists = jest.fn().mockResolvedValue(true);
      mockRepository.update = jest.fn().mockResolvedValue({
        ...mockOrganization,
        ...updateData,
      });

      const result = await service.updateOrganization('org123', updateData, mockAdmin);

      expect(mockRepository.exists).toHaveBeenCalledWith('org123');
      expect(mockRepository.update).toHaveBeenCalledWith('org123', updateData);
      expect(result.name).toBe(updateData.name);
    });

    it('should update organization when user is manager', async () => {
      mockRepository.exists = jest.fn().mockResolvedValue(true);
      mockRepository.update = jest.fn().mockResolvedValue({
        ...mockOrganization,
        ...updateData,
      });

      const result = await service.updateOrganization('org123', updateData, mockManager);

      expect(mockRepository.update).toHaveBeenCalledWith('org123', updateData);
      expect(result.name).toBe(updateData.name);
    });

    it('should throw ForbiddenError when user is volunteer', async () => {
      await expect(
        service.updateOrganization('org123', updateData, mockVolunteer)
      ).rejects.toThrow(ForbiddenError);

      expect(mockRepository.update).not.toHaveBeenCalled();
    });

    it('should throw ForbiddenError when accessing different organization', async () => {
      const differentOrgUser = { ...mockAdmin, orgId: 'different-org' };

      await expect(
        service.updateOrganization('org123', updateData, differentOrgUser)
      ).rejects.toThrow(ForbiddenError);
    });

    it('should throw NotFoundError when organization does not exist', async () => {
      mockRepository.exists = jest.fn().mockResolvedValue(false);

      await expect(service.updateOrganization('org123', updateData, mockAdmin)).rejects.toThrow(
        NotFoundError
      );

      expect(mockRepository.update).not.toHaveBeenCalled();
    });

    it('should throw ConflictError when updating to existing slug', async () => {
      const updateWithSlug = { ...updateData, slug: 'existing-slug' };
      mockRepository.exists = jest.fn().mockResolvedValue(true);
      mockRepository.isSlugTaken = jest.fn().mockResolvedValue(true);

      await expect(
        service.updateOrganization('org123', updateWithSlug, mockAdmin)
      ).rejects.toThrow(ConflictError);

      expect(mockRepository.update).not.toHaveBeenCalled();
    });
  });

  describe('deleteOrganization', () => {
    it('should throw ForbiddenError when user is not admin', async () => {
      await expect(service.deleteOrganization('org123', mockManager)).rejects.toThrow(
        ForbiddenError
      );
    });

    it('should throw ForbiddenError when accessing different organization', async () => {
      const differentOrgUser = { ...mockAdmin, orgId: 'different-org' };

      await expect(service.deleteOrganization('org123', differentOrgUser)).rejects.toThrow(
        ForbiddenError
      );
    });

    it('should throw NotFoundError when organization does not exist', async () => {
      mockRepository.findById = jest.fn().mockResolvedValue(null);

      await expect(service.deleteOrganization('org123', mockAdmin)).rejects.toThrow(
        NotFoundError
      );
    });
  });
});
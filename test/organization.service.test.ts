import { OrganizationService } from '../src/api/v1/organizations/organization.service';
import { Organization } from '../src/api/v1/models/organization';

describe('OrganizationService', () => {
  const mockRepo = {
    create: jest.fn(),
    findById: jest.fn(),
    findAll: jest.fn(),
    update: jest.fn(),
    remove: jest.fn()
  };

  const service = new OrganizationService(mockRepo as any);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('create delegates to repository and returns organization', async () => {
    const input = { name: 'Test Org', slug: 'test-org' };
    const created: Organization = {
      id: '123',
      name: input.name,
      slug: input.slug,
      createdAt: '2024-01-01T00:00:00.000Z'
    };

    mockRepo.create.mockResolvedValue(created);

    const result = await service.create(input);

    expect(mockRepo.create).toHaveBeenCalledWith(input);
    expect(result).toEqual(created);
  });

  test('getById returns organization when found', async () => {
    const org: Organization = {
      id: 'abc',
      name: 'Org A',
      createdAt: '2024-01-01T00:00:00.000Z'
    };

    mockRepo.findById.mockResolvedValue(org);

    const result = await service.getById('abc');

    expect(mockRepo.findById).toHaveBeenCalledWith('abc');
    expect(result).toEqual(org);
  });

  test('getById returns null when not found', async () => {
    mockRepo.findById.mockResolvedValue(null);

    const result = await service.getById('missing-id');

    expect(mockRepo.findById).toHaveBeenCalledWith('missing-id');
    expect(result).toBeNull();
  });

  test('list returns all organizations', async () => {
    const list: Organization[] = [
      { id: '1', name: 'One', createdAt: '2024-01-01T00:00:00.000Z' },
      { id: '2', name: 'Two', createdAt: '2024-01-02T00:00:00.000Z' }
    ];
    mockRepo.findAll.mockResolvedValue(list);

    const result = await service.list();

    expect(mockRepo.findAll).toHaveBeenCalled();
    expect(result).toEqual(list);
  });

  test('update calls repository and returns updated organization', async () => {
    const updated: Organization = {
      id: '1',
      name: 'Updated Org',
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-03T00:00:00.000Z'
    };

    mockRepo.update.mockResolvedValue(updated);

    const result = await service.update('1', { name: 'Updated Org' });

    expect(mockRepo.update).toHaveBeenCalledWith('1', { name: 'Updated Org' });
    expect(result).toEqual(updated);
  });

  test('delete calls repository.remove', async () => {
    mockRepo.remove.mockResolvedValue(undefined);

    await service.delete('1');

    expect(mockRepo.remove).toHaveBeenCalledWith('1');
  });
});
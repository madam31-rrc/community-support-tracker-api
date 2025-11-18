import { VolunteerService } from '../../src/api/v1/volunteers/volunteer.service';
import { Volunteer } from '../../src/api/v1/models/volunteer';

describe('VolunteerService', () => {
  const mockRepo = {
    create: jest.fn(),
    findById: jest.fn(),
    findAll: jest.fn(),
    findByOrganization: jest.fn(),
    update: jest.fn(),
    remove: jest.fn()
  };

  const service = new VolunteerService(mockRepo as any);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('create delegates to repository and returns volunteer', async () => {
    const input = {
      organizationId: 'org-1',
      firstName: 'Adam',
      lastName: 'Muniru',
      email: 'adam@example.com'
    };

    const created: Volunteer = {
      id: 'v1',
      organizationId: input.organizationId,
      firstName: input.firstName,
      lastName: input.lastName,
      email: input.email,
      status: 'active',
      createdAt: '2024-01-01T00:00:00.000Z'
    };

    mockRepo.create.mockResolvedValue(created);

    const result = await service.create(input);

    expect(mockRepo.create).toHaveBeenCalledWith({
    ...input,
    phone: undefined,
    skills: [],
    status: 'active'
  });

  expect(result).toEqual(created);
});

  test('getById returns volunteer when found', async () => {
    const volunteer: Volunteer = {
      id: 'v1',
      organizationId: 'org-1',
      firstName: 'Adam',
      lastName: 'Muniru',
      email: 'adam@example.com',
      status: 'active',
      createdAt: '2024-01-01T00:00:00.000Z'
    };

    mockRepo.findById.mockResolvedValue(volunteer);

    const result = await service.getById('v1');

    expect(mockRepo.findById).toHaveBeenCalledWith('v1');
    expect(result).toEqual(volunteer);
  });

  test('list returns all volunteers when no orgId filter is provided', async () => {
    const volunteers: Volunteer[] = [
      {
        id: 'v1',
        organizationId: 'org-1',
        firstName: 'A',
        lastName: 'B',
        email: 'a@example.com',
        status: 'active',
        createdAt: '2024-01-01T00:00:00.000Z'
      }
    ];

    mockRepo.findAll.mockResolvedValue(volunteers);

    const result = await service.list();

    expect(mockRepo.findAll).toHaveBeenCalled();
    expect(result).toEqual(volunteers);
  });

  test('list filters by organization when orgId is provided', async () => {
    const volunteers: Volunteer[] = [
      {
        id: 'v1',
        organizationId: 'org-1',
        firstName: 'A',
        lastName: 'B',
        email: 'a@example.com',
        status: 'active',
        createdAt: '2024-01-01T00:00:00.000Z'
      }
    ];

    mockRepo.findByOrganization.mockResolvedValue(volunteers);

    const result = await service.list('org-1');

    expect(mockRepo.findByOrganization).toHaveBeenCalledWith('org-1');
    expect(result).toEqual(volunteers);
  });

  test('update calls repository and returns updated volunteer', async () => {
    const updated: Volunteer = {
      id: 'v1',
      organizationId: 'org-1',
      firstName: 'Updated',
      lastName: 'Name',
      email: 'updated@example.com',
      status: 'inactive',
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-02T00:00:00.000Z'
    };

    mockRepo.update.mockResolvedValue(updated);

    const result = await service.update('v1', { firstName: 'Updated' });

    expect(mockRepo.update).toHaveBeenCalledWith('v1', { firstName: 'Updated' });
    expect(result).toEqual(updated);
  });

  test('delete calls repository.remove', async () => {
    mockRepo.remove.mockResolvedValue(undefined);

    await service.delete('v1');

    expect(mockRepo.remove).toHaveBeenCalledWith('v1');
  });
});

import request from 'supertest';
import { createApp } from '/app';
import { Application } from 'express';

jest.mock('../../../config/firebase');

describe('Organization API Integration Tests', () => {
  let app: Application;
  const mockAdminToken = 'mock-admin-token';
  const mockManagerToken = 'mock-manager-token';
  const mockVolunteerToken = 'mock-volunteer-token';

  beforeAll(() => {
    app = createApp();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/v1/organizations', () => {
    const validOrgData = {
      name: 'Test Organization',
      slug: 'test-org',
      description: 'A test organization',
      contactEmail: 'contact@testorg.com',
      digestEnabled: true,
    };

    it('should return 401 when no token provided', async () => {
      const response = await request(app).post('/api/v1/organizations').send(validOrgData);

      expect(response.status).toBe(401);
      expect(response.body.code).toBe('UNAUTHORIZED');
    });

    it('should return 422 when validation fails', async () => {
      const invalidData = {
        name: 'AB',
        slug: 'INVALID SLUG',
      };

      const response = await request(app)
        .post('/api/v1/organizations')
        .set('Authorization', `Bearer ${mockAdminToken}`)
        .send(invalidData);

      expect(response.status).toBe(422);
      expect(response.body.code).toBe('VALIDATION_ERROR');
      expect(response.body.details).toBeDefined();
    });

    it('should validate slug pattern', async () => {
      const invalidSlugData = {
        ...validOrgData,
        slug: 'Invalid_Slug!',
      };

      const response = await request(app)
        .post('/api/v1/organizations')
        .set('Authorization', `Bearer ${mockAdminToken}`)
        .send(invalidSlugData);

      expect(response.status).toBe(422);
      expect(response.body.details).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            field: 'slug',
          }),
        ])
      );
    });

    it('should validate email format', async () => {
      const invalidEmailData = {
        ...validOrgData,
        contactEmail: 'not-an-email',
      };

      const response = await request(app)
        .post('/api/v1/organizations')
        .set('Authorization', `Bearer ${mockAdminToken}`)
        .send(invalidEmailData);

      expect(response.status).toBe(422);
      expect(response.body.details).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            field: 'contactEmail',
          }),
        ])
      );
    });

    it('should validate website URL format', async () => {
      const invalidWebsiteData = {
        ...validOrgData,
        website: 'not-a-url',
      };

      const response = await request(app)
        .post('/api/v1/organizations')
        .set('Authorization', `Bearer ${mockAdminToken}`)
        .send(invalidWebsiteData);

      expect(response.status).toBe(422);
    });
  });

  describe('GET /api/v1/organizations/:id', () => {
    it('should return 401 when no token provided', async () => {
      const response = await request(app).get('/api/v1/organizations/org123');

      expect(response.status).toBe(401);
    });

    it('should validate organization ID parameter', async () => {
      const response = await request(app)
        .get('/api/v1/organizations/')
        .set('Authorization', `Bearer ${mockAdminToken}`);

      expect(response.status).toBe(404);
    });
  });

  describe('PATCH /api/v1/organizations/:id', () => {
    it('should return 401 when no token provided', async () => {
      const response = await request(app)
        .patch('/api/v1/organizations/org123')
        .send({ name: 'Updated Name' });

      expect(response.status).toBe(401);
    });

    it('should validate update data', async () => {
      const invalidUpdate = {
        name: 'A',
      };

      const response = await request(app)
        .patch('/api/v1/organizations/org123')
        .set('Authorization', `Bearer ${mockAdminToken}`)
        .send(invalidUpdate);

      expect(response.status).toBe(422);
    });

    it('should require at least one field to update', async () => {
      const response = await request(app)
        .patch('/api/v1/organizations/org123')
        .set('Authorization', `Bearer ${mockAdminToken}`)
        .send({});

      expect(response.status).toBe(422);
    });

    it('should allow empty string for optional fields', async () => {
      const updateWithEmpty = {
        description: '',
        contactEmail: '',
        website: '',
      };

      const response = await request(app)
        .patch('/api/v1/organizations/org123')
        .set('Authorization', `Bearer ${mockAdminToken}`)
        .send(updateWithEmpty);

      expect(response.status).not.toBe(422);
    });
  });

  describe('GET /api/v1/organizations/:id/summary', () => {
    it('should return 401 when no token provided', async () => {
      const response = await request(app).get('/api/v1/organizations/org123/summary');

      expect(response.status).toBe(401);
    });

    it('should validate organization ID', async () => {
      const response = await request(app)
        .get('/api/v1/organizations//summary')
        .set('Authorization', `Bearer ${mockAdminToken}`);

      expect(response.status).toBe(404);
    });
  });

  describe('DELETE /api/v1/organizations/:id', () => {
    it('should return 401 when no token provided', async () => {
      const response = await request(app).delete('/api/v1/organizations/org123');

      expect(response.status).toBe(401);
    });

    it('should validate organization ID', async () => {
      const response = await request(app)
        .delete('/api/v1/organizations/')
        .set('Authorization', `Bearer ${mockAdminToken}`);

      expect(response.status).toBe(404);
    });
  });

  describe('Rate Limiting', () => {
    it('should apply rate limiting to create endpoint', async () => {
      const orgData = {
        name: 'Test Org',
        slug: 'test-slug',
      };

      const requests = Array(11)
        .fill(null)
        .map(() =>
          request(app)
            .post('/api/v1/organizations')
            .set('Authorization', `Bearer ${mockAdminToken}`)
            .send(orgData)
        );

      const responses = await Promise.all(requests);

      const rateLimited = responses.some((res) => res.status === 429);
      expect(rateLimited).toBe(true);
    });
  });
});
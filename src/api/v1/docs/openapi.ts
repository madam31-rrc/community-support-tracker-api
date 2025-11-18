export const openapi = {
  openapi: '3.0.3',
  info: {
    title: 'Community Support Tracker API',
    version: '1.0.0'
  },
  servers: [{ url: '/api/v1' }],
  paths: {
    '/organizations': {
      get: {
        summary: 'List organizations',
        responses: {
          '200': { description: 'OK' }
        }
      },
      post: {
        summary: 'Create organization',
        responses: {
          '201': { description: 'Created' },
          '400': { description: 'Bad Request' }
        }
      }
    },
    '/organizations/{id}': {
      get: {
        summary: 'Get organization by id',
        parameters: [{ name: 'id', in: 'path', required: true }],
        responses: { '200': { description: 'OK' }, '404': { description: 'Not Found' } }
      },
      patch: {
        summary: 'Update organization',
        parameters: [{ name: 'id', in: 'path', required: true }],
        responses: {
          '200': { description: 'OK' },
          '400': { description: 'Bad Request' },
          '404': { description: 'Not Found' }
        }
      },
      delete: {
        summary: 'Delete organization',
        parameters: [{ name: 'id', in: 'path', required: true }],
        responses: { '204': { description: 'No Content' } }
      }
    }
  }
};

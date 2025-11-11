import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import swaggerUi from 'swagger-ui-express';
import { config } from './config/env';
import { swaggerSpec } from './config/swagger';
import { errorHandler, notFoundHandler } from './api/middleware/error.middleware';
import { apiLimiter } from './api/middleware/rate-limit.middleware';
import { logger } from './api/utils/logger';

export const createApp = (): Application => {
  const app = express();

  app.use(
    helmet({
      contentSecurityPolicy: config.isProduction,
      crossOriginEmbedderPolicy: config.isProduction,
    })
  );

  app.use(
    cors({
      origin: (origin, callback) => {
        if (!origin) return callback(null, true);

        if (config.cors.origins.includes(origin) || config.cors.origins.includes('*')) {
          callback(null, true);
        } else {
          callback(new Error('Not allowed by CORS'));
        }
      },
      credentials: true,
    })
  );


  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  app.use(compression());

  app.use(`/api/${config.apiVersion}`, apiLimiter);

  app.get('/health', (_req, res) => {
    res.status(200).json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: config.env,
    });
  });

  app.use(
    '/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, {
      explorer: true,
      customSiteTitle: 'Volunteer Management API Docs',
    })
  );

  import organizationRoutes from './modules/organizations/organization.routes';
  
  app.use(`/api/${config.apiVersion}/organizations`, organizationRoutes);

  app.use(notFoundHandler);

  app.use(errorHandler);

  logger.info('Express application configured');

  return app;
};

export default createApp;
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';

import { env } from './config/env';
import apiV1Router from './api/v1/routes/index';
import { openapi } from './api/v1/docs/openapi';

const app = express();

app.use(helmet());
app.use(cors({ origin: env.corsOrigin }));
app.use(express.json());

app.get('/health', (_req, res) => res.json({ ok: true }));

app.use('/docs', swaggerUi.serve, swaggerUi.setup(openapi));
app.use('/api/v1', apiV1Router);

// final error handler
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  const status = err.status || 500;
  res.status(status).json({
    status,
    code: err.code || 'INTERNAL_ERROR',
    message: err.message || 'Something went wrong',
    details: err.details
  });
});

export default app;


import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { swaggerUi, swaggerSpec } from "./config/swagger";


import { env } from './config/env';
import apiV1Router from './api/v1/routes/index';
import { apiRateLimiter } from './api/v1/middleware/rate-limit.middleware';

const app = express();

app.use(helmet());
app.use(cors({ origin: env.corsOrigin }));
app.use(express.json());

app.get('/health', (_req, res) => res.json({ ok: true }));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api/v1', apiRateLimiter, apiV1Router);

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


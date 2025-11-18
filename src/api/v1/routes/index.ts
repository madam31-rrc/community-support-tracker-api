import { Router } from 'express';
import organizationRoutes from './organization.routes';

const router = Router();

router.use('/organizations', organizationRoutes);

export default router;

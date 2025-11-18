import { Router } from 'express';
import organizationRoutes from './organization.routes';
import volunteerRoutes from './volunteer.routes';

const router = Router();

router.use('/organizations', organizationRoutes);
router.use('/volunteers', volunteerRoutes);

export default router;

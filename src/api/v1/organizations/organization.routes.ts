import { Router } from 'express';
import { OrganizationController } from './organization.controller';
import { authenticate, requireRole } from '../../api/middleware/auth.middleware';
import { validate } from '../../api/middleware/validation.middleware';
import { createLimiter } from '../../api/middleware/rate-limit.middleware';
import {
  createOrganizationSchema,
  updateOrganizationSchema,
  organizationIdSchema,
} from './organization.validation';
import { UserRole } from '../../api/types/auth.types';

const router = Router();
const controller = new OrganizationController();

router.post(
  '/',
  authenticate,
  requireRole(UserRole.ADMIN),
  createLimiter,
  validate(createOrganizationSchema),
  controller.createOrganization
);

router.get(
  '/:id',
  authenticate,
  validate(organizationIdSchema, 'params'),
  controller.getOrganization
);

router.patch(
  '/:id',
  authenticate,
  requireRole(UserRole.ADMIN, UserRole.MANAGER),
  validate(organizationIdSchema, 'params'),
  validate(updateOrganizationSchema),
  controller.updateOrganization
);


router.get(
  '/:id/summary',
  authenticate,
  validate(organizationIdSchema, 'params'),
  controller.getOrganizationSummary
);

router.delete(
  '/:id',
  authenticate,
  requireRole(UserRole.ADMIN),
  validate(organizationIdSchema, 'params'),
  controller.deleteOrganization
);

export default router;
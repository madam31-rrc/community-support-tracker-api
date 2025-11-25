import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import {
  createOrganization,
  deleteOrganization,
  getOrganization,
  listOrganizations,
  updateOrganization
} from '../controllers/organization.controller';

const router = Router();

router.use(requireAuth);

router.post('/', createOrganization);
router.get('/', listOrganizations);
router.get('/:id', getOrganization);
router.patch('/:id', updateOrganization);
router.delete('/:id', deleteOrganization);

export default router;

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
/**
 * @openapi
 * /api/v1/organizations:
 *   get:
 *     summary: Get all organizations
 *     tags:
 *       - Organizations
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search organizations by name
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *     responses:
 *       200:
 *         description: Successful response
 */

router.get('/', listOrganizations);
router.get('/:id', getOrganization);
router.patch('/:id', updateOrganization);
router.delete('/:id', deleteOrganization);

export default router;

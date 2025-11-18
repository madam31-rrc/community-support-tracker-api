import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import {
  createVolunteer,
  deleteVolunteer,
  getVolunteer,
  listVolunteers,
  updateVolunteer
} from '../controllers/volunteer.controller';

const router = Router();

router.use(requireAuth);

router.post('/', createVolunteer);
router.get('/', listVolunteers);
router.get('/:id', getVolunteer);
router.patch('/:id', updateVolunteer);
router.delete('/:id', deleteVolunteer);

export default router;

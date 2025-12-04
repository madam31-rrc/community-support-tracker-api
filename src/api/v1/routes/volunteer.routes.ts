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

/**
 * @openapi
 * /api/v1/volunteers:
 *   post:
 *     tags:
 *       - Volunteers
 *     summary: Create a new volunteer
 *     description: Create a new volunteer record in the system
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/VolunteerCreateRequest'
 *     responses:
 *       201:
 *         description: Volunteer created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Volunteer'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/', createVolunteer);

/**
 * @openapi
 * /api/v1/volunteers:
 *   get:
 *     tags:
 *       - Volunteers
 *     summary: List all volunteers
 *     description: Retrieve a paginated list of volunteers with optional filtering and sorting
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: organizationId
 *         schema:
 *           type: string
 *         description: Filter volunteers by organization ID
 *         example: "6wcOgrgeXLRR2nE88sYk"
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [active, inactive]
 *         description: Filter volunteers by status
 *         example: "active"
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search volunteers by name or email
 *         example: "john"
 *       - in: query
 *         name: skills
 *         schema:
 *           type: string
 *         description: Filter by skills (comma-separated)
 *         example: "cooking,driving"
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [firstName, lastName, email, createdAt]
 *         description: Field to sort by
 *         example: "firstName"
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *         description: Sort order (ascending or descending)
 *         example: "asc"
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number for pagination
 *         example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Number of items per page
 *         example: 10
 *     responses:
 *       200:
 *         description: Successful response with paginated volunteers
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PagedVolunteerResponse'
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/', listVolunteers);

/**
 * @openapi
 * /api/v1/volunteers/{id}:
 *   get:
 *     tags:
 *       - Volunteers
 *     summary: Get a volunteer by ID
 *     description: Retrieve detailed information about a specific volunteer
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The volunteer ID
 *         example: "vol_abc123"
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Volunteer'
 *       404:
 *         description: Volunteer not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/:id', getVolunteer);

/**
 * @openapi
 * /api/v1/volunteers/{id}:
 *   patch:
 *     tags:
 *       - Volunteers
 *     summary: Update a volunteer (partial)
 *     description: Partially update an existing volunteer's information
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The volunteer ID
 *         example: "vol_abc123"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/VolunteerUpdateRequest'
 *     responses:
 *       200:
 *         description: Volunteer updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Volunteer'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Volunteer not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.patch('/:id', updateVolunteer);

/**
 * @openapi
 * /api/v1/volunteers/{id}:
 *   put:
 *     tags:
 *       - Volunteers
 *     summary: Replace a volunteer (full update)
 *     description: Completely replace an existing volunteer with new data (all fields required)
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The volunteer ID
 *         example: "vol_abc123"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/VolunteerCreateRequest'
 *     responses:
 *       200:
 *         description: Volunteer replaced successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Volunteer'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Volunteer not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.put('/:id', updateVolunteer);

/**
 * @openapi
 * /api/v1/volunteers/{id}:
 *   delete:
 *     tags:
 *       - Volunteers
 *     summary: Delete a volunteer
 *     description: Permanently delete a volunteer from the system
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The volunteer ID
 *         example: "vol_abc123"
 *     responses:
 *       204:
 *         description: Volunteer deleted successfully (no content)
 *       404:
 *         description: Volunteer not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.delete('/:id', deleteVolunteer);

export default router;
import { Request, Response, NextFunction } from 'express';
import {
  createVolunteerSchema,
  updateVolunteerSchema
} from '../models/volunteer';
import { VolunteerService } from '../volunteers/volunteer.service';
import { HttpError } from '../errors/http-errors';

const service = new VolunteerService();

export async function createVolunteer(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { error, value } = createVolunteerSchema.validate(req.body);
    if (error) {
      throw new HttpError(400, error.message, 'VALIDATION_ERROR');
    }
    const created = await service.create(value);
    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
}

export async function listVolunteers(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { organizationId } = req.query;
    const items = await service.list(
      organizationId ? String(organizationId) : undefined
    );
    res.json(items);
  } catch (err) {
    next(err);
  }
}

export async function getVolunteer(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const volunteer = await service.getById(req.params.id);
    if (!volunteer) {
      throw new HttpError(404, 'Volunteer not found', 'NOT_FOUND');
    }
    res.json(volunteer);
  } catch (err) {
    next(err);
  }
}

export async function updateVolunteer(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { error, value } = updateVolunteerSchema.validate(req.body);
    if (error) {
      throw new HttpError(400, error.message, 'VALIDATION_ERROR');
    }

    const updated = await service.update(req.params.id, value);
    if (!updated) {
      throw new HttpError(404, 'Volunteer not found', 'NOT_FOUND');
    }
    res.json(updated);
  } catch (err) {
    next(err);
  }
}

export async function deleteVolunteer(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    await service.delete(req.params.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

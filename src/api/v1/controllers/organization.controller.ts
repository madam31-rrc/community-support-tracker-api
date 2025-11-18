import { Request, Response, NextFunction } from 'express';
import {
  createOrganizationSchema,
  updateOrganizationSchema
} from '../models/organization';
import { OrganizationService } from '../organizations/organization.service';
import { HttpError } from '../errors/http-errors';

const service = new OrganizationService();

export async function createOrganization(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { error, value } = createOrganizationSchema.validate(req.body);
    if (error) {
      throw new HttpError(400, error.message, 'VALIDATION_ERROR');
    }
    const created = await service.create(value);
    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
}

export async function listOrganizations(
  _req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const items = await service.list();
    res.json(items);
  } catch (err) {
    next(err);
  }
}

export async function getOrganization(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const org = await service.getById(req.params.id);
    if (!org) {
      throw new HttpError(404, 'Organization not found', 'NOT_FOUND');
    }
    res.json(org);
  } catch (err) {
    next(err);
  }
}

export async function updateOrganization(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { error, value } = updateOrganizationSchema.validate(req.body);
    if (error) {
      throw new HttpError(400, error.message, 'VALIDATION_ERROR');
    }

    const updated = await service.update(req.params.id, value);
    if (!updated) {
      throw new HttpError(404, 'Organization not found', 'NOT_FOUND');
    }
    res.json(updated);
  } catch (err) {
    next(err);
  }
}

export async function deleteOrganization(
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

import { Request, Response, NextFunction } from 'express';
import {
  createOrganizationSchema,
  updateOrganizationSchema
} from '../models/organization';
import { OrganizationService } from '../organizations/organization.service';
import { HttpError } from '../errors/http-errors';
import { OrganizationFilters, OrganizationSort } from '../organizations/organization.repository';

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
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    // Parse query parameters for filtering
    const filters: OrganizationFilters = {};

    if (req.query.status) {
      filters.status = String(req.query.status) as any;
    }

    if (req.query.search) {
      filters.search = String(req.query.search);
    }

    // Parse sorting
    let sort: OrganizationSort | undefined;
    if (req.query.sortBy) {
      const sortField = String(req.query.sortBy) as any;
      const sortDirection = (String(req.query.sortOrder || 'asc')) as 'asc' | 'desc';

      sort = {
        field: sortField,
        direction: sortDirection
      };
    }

    // Parse pagination
    const limit = req.query.limit ? parseInt(String(req.query.limit)) : 10;
    const page = req.query.page ? parseInt(String(req.query.page)) : 1;
    const offset = (page - 1) * limit;

    const pagination = { limit, offset };

    // Use advanced filtering
    const result = await service.listWithFilters(filters, sort, pagination);

    res.json({
      success: true,
      data: result.data,
      pagination: {
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: Math.ceil(result.total / (result.limit || 10))
      }
    });
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
    const organization = await service.getById(req.params.id);
    if (!organization) {
      throw new HttpError(404, 'Organization not found', 'NOT_FOUND');
    }
    res.json(organization);
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

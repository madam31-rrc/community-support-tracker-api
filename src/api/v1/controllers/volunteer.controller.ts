import { Request, Response, NextFunction } from 'express';
import {
  createVolunteerSchema,
  updateVolunteerSchema
} from '../models/volunteer';
import { VolunteerService } from '../volunteers/volunteer.service';
import { HttpError } from '../errors/http-errors';
import { VolunteerFilters, VolunteerSort } from '../volunteers/volunteer.repository';

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
    // Parse query parameters for filtering
    const filters: VolunteerFilters = {};
    
    if (req.query.organizationId) {
      filters.organizationId = String(req.query.organizationId);
    }
    
    if (req.query.status) {
      filters.status = String(req.query.status) as any;
    }
    
    if (req.query.skills) {
      // Support comma-separated skills: ?skills=cooking,driving
      filters.skills = String(req.query.skills).split(',').map(s => s.trim());
    }
    
    if (req.query.search) {
      filters.search = String(req.query.search);
    }

    // Parse sorting
    let sort: VolunteerSort | undefined;
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
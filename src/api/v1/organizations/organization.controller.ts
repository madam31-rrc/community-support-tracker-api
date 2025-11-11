import { Request, Response, NextFunction } from 'express';
import { OrganizationService } from './organization.service';
import { sendSuccess, sendCreated } from '../../api/utils/responses';
import { UnauthorizedError } from '../../api/utils/errors';

export class OrganizationController {
  private service = new OrganizationService();

  createOrganization = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!req.user) {
        throw new UnauthorizedError('Authentication required');
      }

      const organization = await this.service.createOrganization(req.body, req.user);
      sendCreated(res, organization, 'Organization created successfully');
    } catch (error) {
      next(error);
    }
  };

  getOrganization = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        throw new UnauthorizedError('Authentication required');
      }

      const organization = await this.service.getOrganizationById(req.params.id, req.user);
      sendSuccess(res, organization);
    } catch (error) {
      next(error);
    }
  };

  updateOrganization = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!req.user) {
        throw new UnauthorizedError('Authentication required');
      }

      const organization = await this.service.updateOrganization(
        req.params.id,
        req.body,
        req.user
      );
      sendSuccess(res, organization, 'Organization updated successfully');
    } catch (error) {
      next(error);
    }
  };

  getOrganizationSummary = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!req.user) {
        throw new UnauthorizedError('Authentication required');
      }

      const summary = await this.service.getOrganizationSummary(req.params.id, req.user);
      sendSuccess(res, summary);
    } catch (error) {
      next(error);
    }
  };

  deleteOrganization = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!req.user) {
        throw new UnauthorizedError('Authentication required');
      }

      await this.service.deleteOrganization(req.params.id, req.user);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}
import Joi from 'joi';

export interface Organization {
  id: string;
  name: string;
  slug?: string;
  createdAt: string;
  updatedAt?: string;
}

export const createOrganizationSchema = Joi.object({
  name: Joi.string().min(3).required(),
  slug: Joi.string().alphanum().min(3).max(40).optional()
});

export const updateOrganizationSchema = Joi.object({
  name: Joi.string().min(3),
  slug: Joi.string().alphanum().min(3).max(40)
}).min(1);

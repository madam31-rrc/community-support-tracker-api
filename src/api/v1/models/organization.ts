import Joi from 'joi';

export type Organization = {
  id: string;
  name: string;
  slug?: string;
  createdAt: string; // ISO
  updatedAt?: string;
};

export const createOrgSchema = Joi.object({
  name: Joi.string().min(3).required(),
  slug: Joi.string().alphanum().min(3).max(30).optional()
});

export const updateOrgSchema = Joi.object({
  name: Joi.string().min(3).optional(),
  slug: Joi.string().alphanum().min(3).max(30).optional()
}).min(1);

import Joi from 'joi';

export type VolunteerStatus = 'active' | 'inactive';

export interface Volunteer {
  id: string;
  organizationId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  skills?: string[];
  status: VolunteerStatus;
  createdAt: string;
  updatedAt?: string;
}

export const createVolunteerSchema = Joi.object({
  organizationId: Joi.string().required(),
  firstName: Joi.string().min(2).required(),
  lastName: Joi.string().min(2).required(),
  email: Joi.string().email().required(),
  phone: Joi.string().optional(),
  skills: Joi.array().items(Joi.string()).default([]),
  status: Joi.string().valid('active', 'inactive').default('active')
});

export const updateVolunteerSchema = Joi.object({
  firstName: Joi.string().min(2),
  lastName: Joi.string().min(2),
  email: Joi.string().email(),
  phone: Joi.string(),
  skills: Joi.array().items(Joi.string()),
  status: Joi.string().valid('active', 'inactive')
}).min(1);

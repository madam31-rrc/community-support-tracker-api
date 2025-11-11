import Joi from 'joi';

const addressSchema = Joi.object({
  street: Joi.string().max(200).optional(),
  city: Joi.string().max(100).optional(),
  province: Joi.string().max(100).optional(),
  postalCode: Joi.string().max(20).optional(),
  country: Joi.string().max(100).optional(),
});

export const createOrganizationSchema = Joi.object({
  name: Joi.string().min(3).max(100).required().messages({
    'string.min': 'Organization name must be at least 3 characters',
    'string.max': 'Organization name cannot exceed 100 characters',
    'any.required': 'Organization name is required',
  }),

  slug: Joi.string()
    .min(3)
    .max(50)
    .pattern(/^[a-z0-9-]+$/)
    .required()
    .messages({
      'string.pattern.base': 'Slug must contain only lowercase letters, numbers, and hyphens',
      'string.min': 'Slug must be at least 3 characters',
      'string.max': 'Slug cannot exceed 50 characters',
      'any.required': 'Slug is required',
    }),

  description: Joi.string().max(500).optional().messages({
    'string.max': 'Description cannot exceed 500 characters',
  }),

  address: addressSchema.optional(),

  contactEmail: Joi.string().email().max(100).optional().messages({
    'string.email': 'Contact email must be a valid email address',
  }),

  contactPhone: Joi.string().max(20).optional(),

  website: Joi.string().uri().max(200).optional().messages({
    'string.uri': 'Website must be a valid URL',
  }),

  digestEnabled: Joi.boolean().optional().default(true),
});

export const updateOrganizationSchema = Joi.object({
  name: Joi.string().min(3).max(100).optional().messages({
    'string.min': 'Organization name must be at least 3 characters',
    'string.max': 'Organization name cannot exceed 100 characters',
  }),

  slug: Joi.string()
    .min(3)
    .max(50)
    .pattern(/^[a-z0-9-]+$/)
    .optional()
    .messages({
      'string.pattern.base': 'Slug must contain only lowercase letters, numbers, and hyphens',
      'string.min': 'Slug must be at least 3 characters',
      'string.max': 'Slug cannot exceed 50 characters',
    }),

  description: Joi.string().max(500).optional().allow('').messages({
    'string.max': 'Description cannot exceed 500 characters',
  }),

  address: addressSchema.optional(),

  contactEmail: Joi.string().email().max(100).optional().allow('').messages({
    'string.email': 'Contact email must be a valid email address',
  }),

  contactPhone: Joi.string().max(20).optional().allow(''),

  website: Joi.string().uri().max(200).optional().allow('').messages({
    'string.uri': 'Website must be a valid URL',
  }),

  digestEnabled: Joi.boolean().optional(),
}).min(1);

export const organizationIdSchema = Joi.object({
  id: Joi.string().required().messages({
    'any.required': 'Organization ID is required',
  }),
});
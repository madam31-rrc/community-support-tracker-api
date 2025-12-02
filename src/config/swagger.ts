import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Volunteer Management API",
    version: "1.0.0",
    description:
      "API documentation for the Volunteer Management project (Milestone 3).",
  },
  servers: [
    {
      url: "http://localhost:4000",
      description: "Local development server",
    },
  ],
  components: {
    securitySchemes: {
      BearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        description:
          "Paste a Firebase ID token here. Format: **Bearer &lt;token&gt;**",
      },
    },
    schemas: {
      Address: {
        type: "object",
        properties: {
          street: { type: "string", example: "123 Main St" },
          city: { type: "string", example: "Winnipeg" },
          province: { type: "string", example: "MB" },
          postalCode: { type: "string", example: "R3T 1V3" },
          country: { type: "string", example: "Canada" },
        },
      },
      Organization: {
        type: "object",
        properties: {
          id: {
            type: "string",
            example: "6wcOgrgeXLRR2nE88sYk",
          },
          name: {
            type: "string",
            example: "Red River Food Bank",
          },
          slug: {
            type: "string",
            example: "red-river-food-bank",
          },
          description: {
            type: "string",
            example: "Helps provide food support in the community.",
          },
          address: {
            $ref: "#/components/schemas/Address",
          },
          contactEmail: {
            type: "string",
            format: "email",
            example: "info@rrfoodbank.ca",
          },
          contactPhone: {
            type: "string",
            example: "204-555-1234",
          },
          website: {
            type: "string",
            example: "https://rrfoodbank.ca",
          },
          digestEnabled: {
            type: "boolean",
            example: true,
          },
          createdAt: {
            type: "string",
            example: "2025-11-26T12:34:56.222Z",
          },
        },
      },
      OrganizationCreateRequest: {
        type: "object",
        required: ["name"],
        properties: {
          name: { type: "string", example: "Red River Food Bank" },
          slug: {
            type: "string",
            example: "red-river-food-bank",
            description:
              "If omitted, server can generate from name (optional in our demo).",
          },
          description: {
            type: "string",
            example: "Helps provide food support in the community.",
          },
          address: {
            $ref: "#/components/schemas/Address",
          },
          contactEmail: { type: "string", format: "email" },
          contactPhone: { type: "string" },
          website: { type: "string" },
          digestEnabled: { type: "boolean" },
        },
      },
      PaginationMeta: {
        type: "object",
        properties: {
          total: { type: "integer", example: 2 },
          page: { type: "integer", example: 1 },
          limit: { type: "integer", example: 10 },
          totalPages: { type: "integer", example: 1 },
        },
      },
      PagedOrganizationResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", example: true },
          data: {
            type: "array",
            items: { $ref: "#/components/schemas/Organization" },
          },
          pagination: { $ref: "#/components/schemas/PaginationMeta" },
        },
      },
      ErrorResponse: {
        type: "object",
        properties: {
          status: { type: "integer", example: 400 },
          code: { type: "string", example: "VALIDATION_ERROR" },
          message: { type: "string", example: '"name" is required' },
        },
      },
    },
  },
};

const options: swaggerJSDoc.Options = {
  definition: swaggerDefinition,
  apis: ["./src/api/v1/**/*.ts"],
};

export const swaggerSpec = swaggerJSDoc(options);
export { swaggerUi };

import fs from "fs";
import path from "path";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Volunteer Management API",
    version: "1.0.0",
    description:
      "API documentation for the Volunteer Management project (Milestone 3). Includes organizations, volunteers, and loan management with advanced filtering, sorting, and pagination.",
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
          "Paste a Firebase ID token here. You can get this from the authentication endpoint.",
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
          status: {
            type: "string",
            enum: ["active", "inactive"],
            example: "active",
          },
          createdAt: {
            type: "string",
            format: "date-time",
            example: "2025-11-26T12:34:56.222Z",
          },
          updatedAt: {
            type: "string",
            format: "date-time",
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
            description: "If omitted, server can generate from name.",
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
            example: "info@rrfoodbank.ca" 
          },
          contactPhone: { 
            type: "string",
            example: "204-555-1234" 
          },
          website: { 
            type: "string",
            example: "https://rrfoodbank.ca" 
          },
          digestEnabled: { 
            type: "boolean",
            example: true 
          },
          status: {
            type: "string",
            enum: ["active", "inactive"],
            example: "active",
          },
        },
      },
      OrganizationUpdateRequest: {
        type: "object",
        properties: {
          name: { type: "string", example: "Red River Food Bank" },
          slug: { type: "string", example: "red-river-food-bank" },
          description: { type: "string" },
          address: { $ref: "#/components/schemas/Address" },
          contactEmail: { type: "string", format: "email" },
          contactPhone: { type: "string" },
          website: { type: "string" },
          digestEnabled: { type: "boolean" },
          status: {
            type: "string",
            enum: ["active", "inactive"],
          },
        },
      },
      Volunteer: {
        type: "object",
        properties: {
          id: {
            type: "string",
            example: "vol_abc123",
          },
          organizationId: {
            type: "string",
            example: "6wcOgrgeXLRR2nE88sYk",
          },
          firstName: {
            type: "string",
            example: "John",
          },
          lastName: {
            type: "string",
            example: "Doe",
          },
          email: {
            type: "string",
            format: "email",
            example: "john.doe@example.com",
          },
          phone: {
            type: "string",
            example: "204-555-9876",
          },
          skills: {
            type: "array",
            items: { type: "string" },
            example: ["cooking", "driving", "organizing"],
          },
          status: {
            type: "string",
            enum: ["active", "inactive"],
            example: "active",
          },
          createdAt: {
            type: "string",
            format: "date-time",
            example: "2025-11-26T12:34:56.222Z",
          },
          updatedAt: {
            type: "string",
            format: "date-time",
            example: "2025-11-26T12:34:56.222Z",
          },
        },
      },
      VolunteerCreateRequest: {
        type: "object",
        required: ["organizationId", "firstName", "lastName", "email"],
        properties: {
          organizationId: {
            type: "string",
            example: "6wcOgrgeXLRR2nE88sYk",
          },
          firstName: {
            type: "string",
            example: "John",
          },
          lastName: {
            type: "string",
            example: "Doe",
          },
          email: {
            type: "string",
            format: "email",
            example: "john.doe@example.com",
          },
          phone: {
            type: "string",
            example: "204-555-9876",
          },
          skills: {
            type: "array",
            items: { type: "string" },
            example: ["cooking", "driving"],
          },
          status: {
            type: "string",
            enum: ["active", "inactive"],
            example: "active",
          },
        },
      },
      VolunteerUpdateRequest: {
        type: "object",
        properties: {
          firstName: { type: "string" },
          lastName: { type: "string" },
          email: { type: "string", format: "email" },
          phone: { type: "string" },
          skills: {
            type: "array",
            items: { type: "string" },
          },
          status: {
            type: "string",
            enum: ["active", "inactive"],
          },
        },
      },
      PaginationMeta: {
        type: "object",
        properties: {
          total: { type: "integer", example: 25 },
          page: { type: "integer", example: 1 },
          limit: { type: "integer", example: 10 },
          totalPages: { type: "integer", example: 3 },
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
      PagedVolunteerResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", example: true },
          data: {
            type: "array",
            items: { $ref: "#/components/schemas/Volunteer" },
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
          details: { type: "string" },
        },
      },
    },
  },
};

const options: swaggerJSDoc.Options = {
  definition: swaggerDefinition,
  apis: ["./src/api/v1/**/*.ts"]
};

export const swaggerSpec = swaggerJSDoc(options);
export { swaggerUi };

if (require.main === module) {
  const outPath = path.join(__dirname, "../../docs/swagger.json");
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify(swaggerSpec, null, 2), "utf-8");
  console.log("Swagger spec written to:", outPath);
}
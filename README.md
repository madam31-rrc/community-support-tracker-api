📌 Volunteer Management API

API system for managing volunteer organizations with secure authentication, 
advanced search, pagination, and full API documentation.

Table of Contents:
- Features:
  - User Authentication (JWT)
  - Organization Management
  - Volunteer Management
  - Advanced Search & Filtering
  - Pagination Support
  - Rate Limiting
  - Comprehensive API Documentation (Swagger)
  - Schema Validation (Joi)
  - GitHub Project Organization
- Technologies Used:
  - Node.js
  - Express.js
  - TypeScript
  - Firebase and Firestore for Authentication
  - Joi for Validation
  - JWT for Authentication
  - Swagger for API Documentation
  - Nodemon, ts-node for Development
  - Jest and Supertest for Testing
- Setup Instructions:
  1. Clone the repository
  2. Install dependencies: `npm install`
  3. Set up environment variables (see `.env.example`)
  4. Start the server: `npm run dev`
- API Endpoints:
  - Refer to the Swagger documentation at `/api-docs` after starting the server.
- Testing:
  - Run tests with: `npm test`
- Quick Start Guide:
  1. Register a new user via `POST /api/v1/auth/register`
  2. Log in to receive a JWT via `POST /api/v1/auth/login`
  3. Use the JWT to access protected endpoints for managing organizations and volunteers.
- Authentication Guide:
  - Use JWT tokens in the `Authorization` header as `Bearer <token>` for protected routes.
- Contribution Guidelines:
  - Fork the repository
  - Create a new branch for your feature or bugfix
  - Submit a pull request with a detailed description of your changes
- API Documentation (Swagger):
  - Access the interactive API docs at `/api-docs`
- Testing Instructions:
  - Unit and integration tests are located in the `test` directory.
  - Use `npm test` to run all tests and view coverage reports.
- Architecture Overview:
  - Modular structure with separate layers for routing, controllers, services, and data access.
- Error Handling Strategy:
  - Consistent error response format with appropriate HTTP status codes.
- Validation & Security Details:
  - Input validation using middleware
  - Secure password storage with hashing
  - Rate limiting to prevent abuse

Quick Start Guide:
1. Clone the repository and install dependencies.
2. Create your Firebase project and set up Firestore.
2. Set up environment variables as per `.env.example`.
3. Start the development server using `npm run dev`.
4. Access the API documentation at `http://localhost:4000/api-docs`.
5. Run tests with `npm test`.
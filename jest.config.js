/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/test'],
  moduleFileExtensions: ['ts', 'js', 'json'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest'
  },

  collectCoverageFrom: [
    'src/api/v1/organizations/organization.service.ts'
  ],
  coverageThreshold: {
    global: {
      statements: 65,
      branches: 60,
      functions: 60,
      lines: 65
    }
  }
};

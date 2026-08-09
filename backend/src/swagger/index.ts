import swaggerJsdoc from 'swagger-jsdoc';
import { config } from '../config';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'QA Bug Tracking API',
      version: '1.0.0',
      description: 'REST API for QA Bug Tracking & Test Management System',
    },
    servers: [{ url: `http://localhost:${config.port}/api/v1` }],
    components: {
      securitySchemes: {
        cookieAuth: {
          type: 'apiKey',
          in: 'cookie',
          name: 'accessToken',
        },
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [{ cookieAuth: [] }, { bearerAuth: [] }],
  },
  apis: ['./src/modules/**/*.routes.ts', './src/swagger/*.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);

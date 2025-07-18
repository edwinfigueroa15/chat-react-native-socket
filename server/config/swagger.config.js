import swaggerJsdoc from 'swagger-jsdoc';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Chat App API',
      version: '1.0.0',
      description: 'API Documentation for Chat Application',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        Success: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              description: 'Mensaje de éxito',
            },
            data: {
              type: 'object',
              nullable: true,
              description: 'Datos adicionales del éxito',
            },
            success: {
              type: 'boolean',
              description: 'Indica si la operación fue exitosa',
            },
          },
        },
        Error: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              description: 'Mensaje de error',
            },
            data: {
              type: 'object',
              nullable: true,
              description: 'Datos adicionales del error',
            },
            success: {
              type: 'boolean',
              description: 'Indica si la operación fue exitosa',
            },
          },
        },
      },
      responses: {
        UnauthorizedError: {
          description: 'No autorizado',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
              },
              example: {
                message: 'No autorizado',
                data: null,
                success: false,
              },
            },
          },
        },
        NotFound: {
          description: 'Recurso no encontrado',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
              },
              example: {
                message: 'Recurso no encontrado',
                data: null,
                success: false,
              },
            },
          },
        },
        ServerError: {
          description: 'Error del servidor',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
              },
              example: {
                message: 'Error interno del servidor',
                data: null,
                success: false,
              },
            },
          },
        },
      },
    },
  },
  apis: [
    join(__dirname, '../routes/**/*.js'),
  ],
};

const swaggerSpecs = swaggerJsdoc(options);
export default swaggerSpecs;
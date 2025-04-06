const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const { version } = require('../../package.json');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'StuHouses API Documentation',
      version,
      description: 'API documentation for the StuHouses platform',
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licences/MIT',
      },
      contact: {
        name: 'StuHouses Support',
        url: 'https://stuhouses.com/contact',
        email: 'support@stuhouses.com',
      },
    },
    servers: [
      {
        url: process.env.NODE_ENV === 'production'
          ? 'https://api.stuhouses.com/api'
          : 'http://localhost:5000/api',
        description: process.env.NODE_ENV === 'production' ? 'Production Server' : 'Development Server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
        cookieAuth: {
          type: 'apiKey',
          in: 'cookie',
          name: 'jwt',
        },
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            status: {
              type: 'string',
              example: 'error',
            },
            message: {
              type: 'string',
              example: 'An error occurred',
            },
            transactionId: {
              type: 'string',
              example: '550e8400-e29b-41d4-a716-446655440000',
            },
          },
        },
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              example: 1,
            },
            firstName: {
              type: 'string',
              example: 'John',
            },
            lastName: {
              type: 'string',
              example: 'Doe',
            },
            email: {
              type: 'string',
              example: 'john.doe@example.com',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              example: '2023-01-01T00:00:00Z',
            },
          },
        },
        Property: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              example: 1,
            },
            title: {
              type: 'string',
              example: '3-Bedroom Student House near University',
            },
            slug: {
              type: 'string',
              example: '3-bedroom-student-house-near-university',
            },
            description: {
              type: 'string',
              example: 'A spacious 3-bedroom student house with all bills included...',
            },
            price_per_person_per_week: {
              type: 'number',
              format: 'float',
              example: 125.5,
            },
            bedrooms: {
              type: 'integer',
              example: 3,
            },
            bathrooms: {
              type: 'integer',
              example: 2,
            },
            address_line_1: {
              type: 'string',
              example: '123 Student Lane',
            },
            postcode: {
              type: 'string',
              example: 'LS2 9JT',
            },
            city_id: {
              type: 'integer',
              example: 1,
            },
            city_name: {
              type: 'string',
              example: 'Leeds',
            },
            available_from: {
              type: 'string',
              format: 'date',
              example: '2023-09-01',
            },
            bills_included: {
              type: 'boolean',
              example: true,
            },
            property_type: {
              type: 'string',
              example: 'House',
            },
            is_featured: {
              type: 'boolean',
              example: false,
            },
          },
        },
      },
      responses: {
        UnauthorizedError: {
          description: 'Access token is missing or invalid',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
              },
            },
          },
        },
        NotFoundError: {
          description: 'Resource not found',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
              },
            },
          },
        },
        ValidationError: {
          description: 'Validation failed',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  status: {
                    type: 'string',
                    example: 'fail',
                  },
                  message: {
                    type: 'string',
                    example: 'Validation error',
                  },
                  errors: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        field: {
                          type: 'string',
                          example: 'email',
                        },
                        message: {
                          type: 'string',
                          example: 'Email is required',
                        },
                        value: {
                          type: 'string',
                          example: '',
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
      {
        cookieAuth: [],
      },
    ],
  },
  apis: [
    './src/routes/*.js',
    './src/controllers/*.js',
    './src/models/*.js',
  ],
};

const specs = swaggerJsdoc(options);

const swaggerDocs = (app, port) => {
  // Swagger page
  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(specs, {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'StuHouses API Documentation',
  }));

  // Docs in JSON format
  app.get('/api/docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(specs);
  });

  console.log(`📚 API Documentation available at http://localhost:${port}/api/docs`);
};

module.exports = { swaggerDocs }; 
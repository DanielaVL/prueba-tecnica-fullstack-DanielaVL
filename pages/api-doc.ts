import { createSwaggerSpec } from 'next-swagger-doc';

export const getApiDocs = () => {
  const spec = createSwaggerSpec({
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'API de Gestión Financiera',
        version: '1.0.0',
        description: 'API para la gestión de usuarios y transacciones financieras',
      },
      servers: [
        {
          url: 'http://localhost:3000/api',
          description: 'Servidor de desarrollo',
        },
      ],
      components: {
        schemas: {
          Error: {
            type: 'object',
            properties: {
              message: {
                type: 'string',
              },
            },
          },
          User: {
            type: 'object',
            properties: {
              id: {
                type: 'string',
              },
              name: {
                type: 'string',
              },
              email: {
                type: 'string',
                format: 'email',
              },
              role: {
                type: 'string',
                enum: ['ADMIN', 'USER'],
              },
              telefono: {
                type: 'string',
              },
            },
          },
          Transaction: {
            type: 'object',
            properties: {
              id: {
                type: 'string',
              },
              concepto: {
                type: 'string',
              },
              monto: {
                type: 'number',
                format: 'float',
              },
              fecha: {
                type: 'string',
                format: 'date-time',
              },
              tipo: {
                type: 'string',
                enum: ['INGRESO', 'EGRESO'],
              },
              usuarioId: {
                type: 'string',
              },
              usuarioNombre: {
                type: 'string',
              },
            },
          },
        },
        securitySchemes: {
          nextAuth: {
            type: 'http',
            scheme: 'bearer',
          },
        },
      },
      security: [
        {
          nextAuth: [],
        },
      ],
      paths: {
        '/users': {
          get: {
            summary: 'Obtener todos los usuarios',
            description: 'Retorna una lista de todos los usuarios registrados',
            tags: ['Usuarios'],
            security: [{ nextAuth: [] }],
            responses: {
              '200': {
                description: 'Lista de usuarios obtenida exitosamente',
                content: {
                  'application/json': {
                    schema: {
                      type: 'array',
                      items: {
                        $ref: '#/components/schemas/User',
                      },
                    },
                  },
                },
              },
              '401': {
                description: 'No autorizado',
                content: {
                  'application/json': {
                    schema: {
                      $ref: '#/components/schemas/Error',
                    },
                  },
                },
              },
              '403': {
                description: 'Acceso denegado - Se requiere rol de administrador',
                content: {
                  'application/json': {
                    schema: {
                      $ref: '#/components/schemas/Error',
                    },
                  },
                },
              },
            },
          },
        },
        '/transactions': {
          get: {
            summary: 'Obtener todas las transacciones',
            description: 'Retorna una lista de todas las transacciones registradas',
            tags: ['Transacciones'],
            security: [{ nextAuth: [] }],
            responses: {
              '200': {
                description: 'Lista de transacciones obtenida exitosamente',
                content: {
                  'application/json': {
                    schema: {
                      type: 'array',
                      items: {
                        $ref: '#/components/schemas/Transaction',
                      },
                    },
                  },
                },
              },
              '401': {
                description: 'No autorizado',
                content: {
                  'application/json': {
                    schema: {
                      $ref: '#/components/schemas/Error',
                    },
                  },
                },
              },
            },
          },
          post: {
            summary: 'Crear una nueva transacción',
            description: 'Crea una nueva transacción en el sistema',
            tags: ['Transacciones'],
            security: [{ nextAuth: [] }],
            requestBody: {
              required: true,
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    required: ['concepto', 'monto', 'fecha', 'tipo'],
                    properties: {
                      concepto: {
                        type: 'string',
                      },
                      monto: {
                        type: 'number',
                        format: 'float',
                        minimum: 0,
                      },
                      fecha: {
                        type: 'string',
                        format: 'date-time',
                      },
                      tipo: {
                        type: 'string',
                        enum: ['INGRESO', 'EGRESO'],
                      },
                    },
                  },
                },
              },
            },
            responses: {
              '201': {
                description: 'Transacción creada exitosamente',
                content: {
                  'application/json': {
                    schema: {
                      $ref: '#/components/schemas/Transaction',
                    },
                  },
                },
              },
              '400': {
                description: 'Datos inválidos',
                content: {
                  'application/json': {
                    schema: {
                      $ref: '#/components/schemas/Error',
                    },
                  },
                },
              },
              '401': {
                description: 'No autorizado',
                content: {
                  'application/json': {
                    schema: {
                      $ref: '#/components/schemas/Error',
                    },
                  },
                },
              },
              '403': {
                description: 'Acceso denegado - Se requiere rol de administrador',
                content: {
                  'application/json': {
                    schema: {
                      $ref: '#/components/schemas/Error',
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });
  return spec;
};
// @ts-nocheck
export const getApiDocs = async () => {
  if (typeof window !== 'undefined' || process.env.NODE_ENV === 'production') {
    return {
      openapi: '3.0.0',
      info: {
        title: 'Documentación no disponible en producción',
        version: '1.0.0',
      },
      paths: {},
    };
  }

  // Import dinámico de next-swagger-doc para evitar problemas de fs en frontend
  const { createSwaggerSpec } = await import('next-swagger-doc');

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
            properties: { message: { type: 'string' } },
          },
          User: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              name: { type: 'string' },
              email: { type: 'string', format: 'email' },
              role: { type: 'string', enum: ['ADMIN', 'USER'] },
              telefono: { type: 'string' },
            },
          },
          Transaction: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              concepto: { type: 'string' },
              monto: { type: 'number', format: 'float' },
              fecha: { type: 'string', format: 'date-time' },
              tipo: { type: 'string', enum: ['INGRESO', 'EGRESO'] },
              usuarioId: { type: 'string' },
              usuarioNombre: { type: 'string' },
            },
          },
        },
        securitySchemes: {
          nextAuth: { type: 'http', scheme: 'bearer' },
        },
      },
      security: [{ nextAuth: [] }],
      paths: {
        '/users': {
          get: {
            summary: 'Obtener todos los usuarios',
            description: 'Retorna una lista de todos los usuarios registrados',
            tags: ['Usuarios'],
            security: [{ nextAuth: [] }],
            responses: {
              '200': { description: 'Lista de usuarios obtenida exitosamente' },
              '401': { description: 'No autorizado' },
              '403': { description: 'Acceso denegado - Se requiere rol de administrador' },
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
              '200': { description: 'Lista de transacciones obtenida exitosamente' },
              '401': { description: 'No autorizado' },
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
                      concepto: { type: 'string' },
                      monto: { type: 'number', minimum: 0 },
                      fecha: { type: 'string', format: 'date-time' },
                      tipo: { type: 'string', enum: ['INGRESO', 'EGRESO'] },
                    },
                  },
                },
              },
            },
            responses: {
              '201': { description: 'Transacción creada exitosamente' },
              '400': { description: 'Datos inválidos' },
              '401': { description: 'No autorizado' },
              '403': { description: 'Acceso denegado - Se requiere rol de administrador' },
            },
          },
        },
      },
    },
  });

  return spec;
};

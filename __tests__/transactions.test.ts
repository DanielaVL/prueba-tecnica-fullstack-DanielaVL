import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth/next';

// Mock de next-auth
jest.mock('next-auth/next', () => ({
  getServerSession: jest.fn()
}));

// Mock del módulo [...nextauth].ts
jest.mock('../pages/api/auth/[...nextauth]', () => ({
  authOptions: {
    providers: [],
    callbacks: {}
  }
}));

// Mock de PrismaClient
jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn().mockImplementation(() => ({
    movimiento: {
      create: jest.fn(),
      findMany: jest.fn(),
    },
  }))
}));

// Importar después de los mocks
import handler from '../pages/api/transactions';

// Mock NextAuth
jest.mock('next-auth/next', () => ({
  getServerSession: jest.fn(),
}));

// Mock Prisma
jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn().mockImplementation(() => ({
    movimiento: {
      create: jest.fn(),
      findMany: jest.fn(),
    },
  })),
}));

describe('Transactions API', () => {
  let mockReq: Partial<NextApiRequest>;
  let mockRes: Partial<NextApiResponse>;
  let mockJson: jest.Mock;
  let mockStatus: jest.Mock;

  beforeEach(() => {
    mockJson = jest.fn();
    mockStatus = jest.fn().mockReturnThis();
    mockRes = {
      json: mockJson,
      status: mockStatus,
    };
  });

  describe('POST /api/transactions', () => {
    test('should reject transactions with negative amounts', async () => {
      // Simular sesión de administrador autenticada
      (getServerSession as jest.Mock).mockResolvedValue({
        user: { id: '1', role: 'ADMIN' }
      });

      mockReq = {
        method: 'POST',
        body: {
          concepto: 'Test Transaction',
          monto: -100,
          fecha: new Date().toISOString(),
          tipo: 'INGRESO'
        }
      };

      await handler(mockReq as NextApiRequest, mockRes as NextApiResponse);

      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({ 
        message: 'El monto debe ser mayor que 0' 
      });
    });

    test('should validate date format', async () => {
      (getServerSession as jest.Mock).mockResolvedValue({
        user: { id: '1', role: 'ADMIN' }
      });

      mockReq = {
        method: 'POST',
        body: {
          concepto: 'Test Transaction',
          monto: 100,
          fecha: 'invalid-date',
          tipo: 'INGRESO'
        }
      };

      await handler(mockReq as NextApiRequest, mockRes as NextApiResponse);

      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({ 
        message: 'Fecha inválida' 
      });
    });

    test('should require all mandatory fields', async () => {
      (getServerSession as jest.Mock).mockResolvedValue({
        user: { id: '1', role: 'ADMIN' }
      });

      mockReq = {
        method: 'POST',
        body: {
          concepto: '',
          monto: 100,
          fecha: new Date().toISOString(),
          tipo: 'INGRESO'
        }
      };

      await handler(mockReq as NextApiRequest, mockRes as NextApiResponse);

      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({ 
        message: 'Todos los campos son obligatorios' 
      });
    });
  });
});
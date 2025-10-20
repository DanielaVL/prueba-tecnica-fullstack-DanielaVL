import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { auth } from '@/lib/auth';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await auth();
  if (!session) return res.status(401).json({ error: 'No autenticado' });

  const user = session.user;

  switch (req.method) {
    case 'GET': {
      const movimientos = await prisma.movimiento.findMany({
        include: { usuario: true },
        orderBy: { fecha: 'desc' },
      });
      return res.json(movimientos);
    }

    case 'POST': {
      // Cargar el usuario desde la base de datos para obtener el rol
      const dbUser = await prisma.user.findUnique({ where: { id: user.id } });
      if (!dbUser) return res.status(404).json({ error: 'Usuario no encontrado' });
      if (dbUser.role !== 'ADMIN') return res.status(403).json({ error: 'No autorizado' });

      const { concepto, monto, fecha, tipo } = req.body;
      const nuevo = await prisma.movimiento.create({
        data: {
          concepto,
          monto: parseFloat(monto),
          fecha: new Date(fecha),
          tipo,
          usuarioId: user.id,
        },
      });
      return res.status(201).json(nuevo);
    }

    default:
      return res.status(405).json({ error: 'Método no permitido' });
  }
}

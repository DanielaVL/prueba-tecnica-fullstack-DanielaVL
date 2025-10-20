import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { auth } from '@/lib/auth';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await auth();
  if (!session) return res.status(401).json({ error: 'No autenticado' });

  const user = session.user;
  const { id } = req.query;

  switch (req.method) {
    case 'PUT': {
      const dbUser = await prisma.user.findUnique({ where: { id: user.id } });
      if (!dbUser) return res.status(404).json({ error: 'Usuario no encontrado' });
      if (dbUser.role !== 'ADMIN') return res.status(403).json({ error: 'No autorizado' });
      
      const { concepto, monto, fecha, tipo } = req.body;
      const actualizado = await prisma.movimiento.update({
        where: { id: String(id) },
        data: { concepto, monto: parseFloat(monto), fecha: new Date(fecha), tipo },
      });
      return res.json(actualizado);
    }

    case 'DELETE': {
      const dbUser = await prisma.user.findUnique({ where: { id: user.id } });
      if (!dbUser) return res.status(404).json({ error: 'Usuario no encontrado' });
      if (dbUser.role !== 'ADMIN') return res.status(403).json({ error: 'No autorizado' });
      
      await prisma.movimiento.delete({ where: { id: String(id) } });
      return res.status(204).end();
    }

    default:
      return res.status(405).json({ error: 'Método no permitido' });
  }
}

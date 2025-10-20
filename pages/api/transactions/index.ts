import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ message: "No autorizado" });
  }

  const userId = session.user.id;
  const isAdmin = session.user.role === "ADMIN";

  if (req.method === "GET") {
    try {
      const movimientos = await prisma.movimiento.findMany({
        orderBy: { fecha: "desc" },
        include: { usuario: true },
      });

      const result = movimientos.map((m) => ({
        id: m.id,
        concepto: m.concepto,
        monto: m.monto,
        fecha: m.fecha,
        tipo: m.tipo,
        usuarioId: m.usuarioId,
        usuarioNombre: m.usuario.name,
      }));

      return res.status(200).json(result);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Error al obtener movimientos" });
    }
  }

  if (req.method === "POST") {
    if (!isAdmin) return res.status(403).json({ message: "Acceso denegado" });

    const { concepto, monto, fecha, tipo } = req.body;
    if (!concepto || !monto || !fecha || !tipo) {
      return res.status(400).json({ message: "Todos los campos son obligatorios" });
    }

    const fechaObj = new Date(fecha);
    if (fechaObj.toString() === "Invalid Date") {
      return res.status(400).json({ message: "Fecha inválida" });
    }

    try {
      const movimiento = await prisma.movimiento.create({
        data: { concepto, monto: parseFloat(monto), fecha: fechaObj, tipo, usuarioId: userId },
      });
      return res.status(201).json(movimiento);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Error al crear movimiento" });
    }
  }

  res.setHeader("Allow", ["GET", "POST"]);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}

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

  const isAdmin = session.user.role === "ADMIN";
  const { id } = req.query;

  if (!id || typeof id !== "string") {
    return res.status(400).json({ message: "ID inválido" });
  }

  if (req.method === "PUT") {
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
      const updated = await prisma.movimiento.update({
        where: { id },
        data: {
          concepto,
          monto: parseFloat(monto),
          fecha: fechaObj,
          tipo,
        },
      });
      return res.status(200).json(updated);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Error al actualizar movimiento" });
    }
  }

  if (req.method === "DELETE") {
    if (!isAdmin) return res.status(403).json({ message: "Acceso denegado" });

    try {
      await prisma.movimiento.delete({ where: { id } });
      return res.status(200).json({ message: "Movimiento eliminado" });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Error al eliminar movimiento" });
    }
  }

  res.setHeader("Allow", ["PUT", "DELETE"]);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}

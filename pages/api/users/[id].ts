import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) return res.status(401).json({ message: "No autorizado" });
  const isAdmin = session.user.role === "ADMIN";
  if (!isAdmin) return res.status(403).json({ message: "Acceso denegado" });

  const { id } = req.query;
  if (!id || typeof id !== "string") return res.status(400).json({ message: "ID inválido" });

  if (req.method === "PUT") {
    const { name, role, telefono } = req.body;
    if (!name || !role) return res.status(400).json({ message: "Nombre y rol son obligatorios" });

    try {
      const updated = await prisma.user.update({
        where: { id },
        data: { name, role, telefono },
        select: { id: true, name: true, email: true, role: true, telefono: true },
      });
      return res.status(200).json(updated);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Error al actualizar usuario" });
    }
  }

  if (req.method === "DELETE") {
    try {
      await prisma.user.delete({ where: { id } });
      return res.status(200).json({ message: "Usuario eliminado" });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Error al eliminar usuario" });
    }
  }

  res.setHeader("Allow", ["PUT", "DELETE"]);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}

"use client";

import { useEffect, useState } from "react";
import { getSession } from "next-auth/react";
import axios from "axios";
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
} from "@/components/ui/table";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  telefono?: string;
}

export default function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [editUser, setEditUser] = useState<User | null>(null);

  const fetchUsers = async () => {
    try {
      const session = await getSession();
      if (!session || session.user.role !== "ADMIN") {
        alert("Acceso denegado");
        return;
      }
      const res = await axios.get("/api/users");
      setUsers(res.data);
    } catch (err) {
      console.error(err);
      alert("Error al obtener usuarios");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleEdit = (user: User) => {
    setEditUser(user);
  };

  const handleSave = async () => {
    if (!editUser) return;
    try {
      await axios.put(`/api/users/${editUser.id}`, editUser);
      fetchUsers();
      setEditUser(null);
    } catch (err) {
      console.error(err);
      alert("Error al guardar cambios");
    }
  };

  if (loading)
    return <div className="flex justify-center items-center h-screen bg-gray-100">Cargando...</div>;

  return (
    <Layout withSidebar={false} footerFixed>
      <div className="relative min-h-screen bg-gray-100">
        <div className="flex justify-center items-start p-6">
          <div className="w-full max-w-4xl bg-white p-6 rounded shadow">
            <h1 className="text-2xl font-bold mb-4 text-center">Usuarios</h1>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Correo</TableHead>
                  <TableHead>Rol</TableHead>
                  <TableHead>Teléfono</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((u) => (
                  <TableRow key={u.id}>
                    <TableCell>
                      {editUser?.id === u.id ? (
                        <Input
                          className="text-center"
                          value={editUser.name}
                          onChange={(e) => setEditUser({ ...editUser, name: e.target.value })}
                        />
                      ) : (
                        u.name
                      )}
                    </TableCell>
                    <TableCell>{u.email}</TableCell>
                    <TableCell>
                      {editUser?.id === u.id ? (
                        <select
                          className="w-full border px-1 py-1 text-center rounded"
                          value={editUser.role}
                          onChange={(e) => setEditUser({ ...editUser, role: e.target.value })}
                        >
                          <option value="ADMIN">ADMIN</option>
                          <option value="USUARIO">USUARIO</option>
                        </select>
                      ) : (
                        u.role
                      )}
                    </TableCell>
                    <TableCell>
                      {editUser?.id === u.id ? (
                        <Input
                          className="text-center"
                          value={editUser.telefono || ""}
                          onChange={(e) => setEditUser({ ...editUser, telefono: e.target.value })}
                        />
                      ) : (
                        u.telefono || "-"
                      )}
                    </TableCell>
                    <TableCell>
                      {editUser?.id === u.id ? (
                        <>
                          <Button
                            variant="secondary"
                            onClick={handleSave}
                            className="mr-2"
                          >
                            Guardar
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => setEditUser(null)}
                          >
                            Cancelar
                          </Button>
                        </>
                      ) : (
                        <Button
                          variant="primary"
                          onClick={() => handleEdit(u)}
                        >
                          Editar
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </Layout>
  );
}

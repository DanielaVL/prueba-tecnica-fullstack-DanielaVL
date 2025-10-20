"use client";

import { useEffect, useState } from "react";
import { getSession } from "next-auth/react";
import axios from "axios";

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

  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar usuario?")) return;
    try {
      await axios.delete(`/api/users/${id}`);
      fetchUsers();
    } catch (err) {
      console.error(err);
      alert("Error al eliminar usuario");
    }
  };

  if (loading) return <div>Cargando...</div>;

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Usuarios</h1>
      <table className="min-w-full border border-gray-300">
        <thead>
          <tr>
            <th className="border px-2 py-1">Nombre</th>
            <th className="border px-2 py-1">Correo</th>
            <th className="border px-2 py-1">Rol</th>
            <th className="border px-2 py-1">Teléfono</th>
            <th className="border px-2 py-1">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td className="border px-2 py-1">
                {editUser?.id === u.id ? (
                  <input
                    value={editUser.name}
                    onChange={(e) => setEditUser({ ...editUser, name: e.target.value })}
                  />
                ) : (
                  u.name
                )}
              </td>
              <td className="border px-2 py-1">{u.email}</td>
              <td className="border px-2 py-1">
                {editUser?.id === u.id ? (
                  <select
                    value={editUser.role}
                    onChange={(e) => setEditUser({ ...editUser, role: e.target.value })}
                  >
                    <option value="ADMIN">ADMIN</option>
                    <option value="USUARIO">USUARIO</option>
                  </select>
                ) : (
                  u.role
                )}
              </td>
              <td className="border px-2 py-1">
                {editUser?.id === u.id ? (
                  <input
                    value={editUser.telefono || ""}
                    onChange={(e) => setEditUser({ ...editUser, telefono: e.target.value })}
                  />
                ) : (
                  u.telefono || "-"
                )}
              </td>
              <td className="border px-2 py-1">
                {editUser?.id === u.id ? (
                  <>
                    <button onClick={handleSave} className="px-2 py-1 bg-green-500 text-white">
                      Guardar
                    </button>
                    <button
                      onClick={() => setEditUser(null)}
                      className="px-2 py-1 bg-gray-400 text-white ml-2"
                    >
                      Cancelar
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => handleEdit(u)}
                      className="px-2 py-1 bg-blue-500 text-white"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(u.id)}
                      className="px-2 py-1 bg-red-500 text-white ml-2"
                    >
                      Eliminar
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

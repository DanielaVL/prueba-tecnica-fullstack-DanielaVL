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

  if (loading)
    return <div className="flex justify-center items-center h-screen bg-gray-100">Cargando...</div>;

  return (
    <div className="relative min-h-screen bg-gray-100">
      <div className="flex justify-center items-start p-6">
        <div className="w-full max-w-4xl bg-white p-6 rounded shadow">
          <h1 className="text-2xl font-bold mb-4 text-center">Usuarios</h1>
          <table className="w-full border border-gray-300 text-center">
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
                        className="border px-1 py-1 text-center w-full"
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
                        className="border px-1 py-1 text-center w-full"
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
                        className="border px-1 py-1 text-center w-full"
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
                        <button
                          onClick={handleSave}
                          className="px-2 py-1 bg-green-500 text-white rounded"
                        >
                          Guardar
                        </button>
                        <button
                          onClick={() => setEditUser(null)}
                          className="px-2 py-1 bg-gray-400 text-white rounded"
                        >
                          Cancelar
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => handleEdit(u)}
                        className="px-2 py-1 bg-blue-500 text-white rounded"
                      >
                        Editar
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full absolute bottom-0">
        <img src="/footer.jpg" alt="Footer" className="w-full h-36" />
      </footer>
    </div>
  );
}

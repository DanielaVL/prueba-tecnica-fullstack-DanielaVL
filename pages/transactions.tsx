import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

type Movimiento = {
  id: string;
  concepto: string;
  monto: number;
  fecha: string;
  tipo: "INGRESO" | "EGRESO";
  usuarioId: string;
};

export default function Transactions() {
  const { data: session } = useSession();
  const [movimientos, setMovimientos] = useState<Movimiento[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    concepto: "",
    monto: "",
    fecha: "",
    tipo: "INGRESO",
  });
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  // Fetch movimientos
  const fetchMovimientos = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/transactions");
      if (!res.ok) throw new Error("Error al obtener movimientos");
      const data: Movimiento[] = await res.json();
      setMovimientos(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Error al obtener movimientos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovimientos();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.concepto || !form.monto || !form.fecha || !form.tipo) {
      setError("Todos los campos son obligatorios");
      return;
    }

    if (isNaN(Number(form.monto))) {
      setError("El monto debe ser un número");
      return;
    }

    const fechaValida = new Date(form.fecha);
    if (fechaValida.toString() === "Invalid Date") {
      setError("Fecha inválida");
      return;
    }

    try {
      let res: Response;
      if (editingId) {
        // Editar movimiento
        res = await fetch(`/api/transactions/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            concepto: form.concepto,
            monto: parseFloat(form.monto),
            fecha: form.fecha,
            tipo: form.tipo,
          }),
        });
      } else {
        // Crear movimiento
        res = await fetch("/api/transactions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            concepto: form.concepto,
            monto: parseFloat(form.monto),
            fecha: form.fecha,
            tipo: form.tipo,
          }),
        });
      }

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Error al guardar el movimiento");
      }

      const mov: Movimiento = await res.json();

      if (editingId) {
        setMovimientos((prev) =>
          prev.map((m) => (m.id === editingId ? mov : m))
        );
        setEditingId(null);
      } else {
        setMovimientos([mov, ...movimientos]);
      }

      setForm({ concepto: "", monto: "", fecha: "", tipo: "INGRESO" });
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Error al guardar el movimiento");
    }
  };

  const handleEdit = (mov: Movimiento) => {
    setForm({
      concepto: mov.concepto,
      monto: mov.monto.toString(),
      fecha: new Date(mov.fecha).toISOString().split("T")[0],
      tipo: mov.tipo,
    });
    setEditingId(mov.id);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Seguro que deseas eliminar este movimiento?")) return;
    try {
      const res = await fetch(`/api/transactions/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Error al eliminar movimiento");
      setMovimientos((prev) => prev.filter((m) => m.id !== id));
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Error al eliminar movimiento");
    }
  };

  if (!session) return <p>No autorizado</p>;

  const isAdmin = session.user?.role === "ADMIN";

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Movimientos</h1>

      {/* Formulario solo para ADMIN */}
      {isAdmin && (
        <form onSubmit={handleSubmit} className="mb-6 space-y-2">
          {error && <p className="text-red-500">{error}</p>}
          <input
            type="text"
            name="concepto"
            placeholder="Concepto"
            value={form.concepto}
            onChange={handleChange}
            className="border p-2 w-full"
          />
          <input
            type="number"
            name="monto"
            placeholder="Monto"
            value={form.monto}
            onChange={handleChange}
            className="border p-2 w-full"
          />
          <input
            type="date"
            name="fecha"
            value={form.fecha}
            onChange={handleChange}
            className="border p-2 w-full"
          />
          <select
            name="tipo"
            value={form.tipo}
            onChange={handleChange}
            className="border p-2 w-full"
          >
            <option value="INGRESO">Ingreso</option>
            <option value="EGRESO">Egreso</option>
          </select>
          <button
            type="submit"
            className="bg-blue-500 text-white p-2 rounded w-full"
          >
            {editingId ? "Guardar cambios" : "Agregar Movimiento"}
          </button>
        </form>
      )}

      {/* Tabla */}
      {loading ? (
        <p>Cargando...</p>
      ) : movimientos.length === 0 ? (
        <p>No hay movimientos</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border p-2">Concepto</th>
              <th className="border p-2">Monto</th>
              <th className="border p-2">Fecha</th>
              <th className="border p-2">Tipo</th>
              {isAdmin && <th className="border p-2">Acciones</th>}
            </tr>
          </thead>
          <tbody>
            {movimientos.map((m) => (
              <tr key={m.id}>
                <td className="border p-2">{m.concepto}</td>
                <td className="border p-2">{m.monto.toLocaleString()}</td>
                <td className="border p-2">{new Date(m.fecha).toLocaleDateString()}</td>
                <td className="border p-2">{m.tipo}</td>
                {isAdmin && (
                  <td className="border p-2 space-x-2">
                    <button
                      className="bg-yellow-400 text-white px-2 py-1 rounded"
                      onClick={() => handleEdit(m)}
                    >
                      Editar
                    </button>
                    <button
                      className="bg-red-500 text-white px-2 py-1 rounded"
                      onClick={() => handleDelete(m.id)}
                    >
                      Eliminar
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

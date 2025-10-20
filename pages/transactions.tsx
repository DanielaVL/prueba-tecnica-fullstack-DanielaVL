import { useEffect, useState } from 'react';
import { useAuth } from '../lib/auth/client';

interface Movimiento {
  id: string;
  concepto: string;
  monto: number;
  fecha: string;
  tipo: 'INGRESO' | 'EGRESO';
  usuario: { nombre: string };
}

export default function Transactions() {
  const { session } = useAuth();
  const [movimientos, setMovimientos] = useState<Movimiento[]>([]);
  const [form, setForm] = useState({ concepto: '', monto: '', fecha: '', tipo: 'INGRESO' });
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    const res = await fetch('/api/transactions');
    const data = await res.json();
    setMovimientos(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/transactions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      setForm({ concepto: '', monto: '', fecha: '', tipo: 'INGRESO' });
      fetchData();
    }
  };

  if (loading) return <p>Cargando...</p>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold mb-4">Gestión de Ingresos y Egresos</h1>

      {session?.user?.role === 'ADMIN' && (
        <form onSubmit={handleSubmit} className="flex gap-4 mb-6">
          <input
            className="border p-2"
            placeholder="Concepto"
            value={form.concepto}
            onChange={(e) => setForm({ ...form, concepto: e.target.value })}
          />
          <input
            className="border p-2"
            placeholder="Monto"
            type="number"
            value={form.monto}
            onChange={(e) => setForm({ ...form, monto: e.target.value })}
          />
          <input
            className="border p-2"
            type="date"
            value={form.fecha}
            onChange={(e) => setForm({ ...form, fecha: e.target.value })}
          />
          <select
            className="border p-2"
            value={form.tipo}
            onChange={(e) => setForm({ ...form, tipo: e.target.value })}
          >
            <option value="INGRESO">Ingreso</option>
            <option value="EGRESO">Egreso</option>
          </select>
          <button className="bg-blue-600 text-white px-4 py-2 rounded" type="submit">
            Agregar
          </button>
        </form>
      )}

      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-2 border">Concepto</th>
            <th className="p-2 border">Monto</th>
            <th className="p-2 border">Fecha</th>
            <th className="p-2 border">Tipo</th>
            <th className="p-2 border">Usuario</th>
          </tr>
        </thead>
        <tbody>
          {movimientos.map((m) => (
            <tr key={m.id}>
              <td className="p-2 border">{m.concepto}</td>
              <td className="p-2 border">${m.monto.toFixed(2)}</td>
              <td className="p-2 border">{new Date(m.fecha).toLocaleDateString()}</td>
              <td className="p-2 border">{m.tipo}</td>
              <td className="p-2 border">{m.usuario.nombre}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

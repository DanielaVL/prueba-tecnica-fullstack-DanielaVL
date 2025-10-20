"use client";

import { useEffect, useState } from "react";
import { getSession } from "next-auth/react";
import axios from "axios";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import { Bar } from "react-chartjs-2";
import { CSVLink } from "react-csv";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface Movimiento {
  id: string;
  concepto: string;
  monto: number;
  tipo: "INGRESO" | "EGRESO";
  fecha: string;
}

export default function Reports() {
  const [movimientos, setMovimientos] = useState<Movimiento[]>([]);
  const [loading, setLoading] = useState(true);
  const [saldo, setSaldo] = useState(0);

  const fetchMovimientos = async () => {
    try {
      const session = await getSession();
      if (!session || session.user.role !== "ADMIN") {
        alert("Acceso denegado");
        return;
      }

      const res = await axios.get("/api/transactions");
      setMovimientos(res.data);

      // Calcular saldo
      const ingresos = res.data.filter((m: any) => m.tipo === "INGRESO").reduce((a: number, b: any) => a + b.monto, 0);
      const egresos = res.data.filter((m: any) => m.tipo === "EGRESO").reduce((a: number, b: any) => a + b.monto, 0);
      setSaldo(ingresos - egresos);
    } catch (err) {
      console.error(err);
      alert("Error al obtener movimientos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovimientos();
  }, []);

  if (loading) return <div className="flex justify-center items-center h-screen">Cargando...</div>;

  // Preparar datos para gráfico
  const groupedByConcepto = movimientos.reduce((acc: any, m: Movimiento) => {
    if (!acc[m.concepto]) acc[m.concepto] = { ingreso: 0, egreso: 0 };
    if (m.tipo === "INGRESO") acc[m.concepto].ingreso += m.monto;
    if (m.tipo === "EGRESO") acc[m.concepto].egreso += m.monto;
    return acc;
  }, {});

  const labels = Object.keys(groupedByConcepto);
  const data = {
    labels,
    datasets: [
      {
        label: "Ingresos",
        data: labels.map((l) => groupedByConcepto[l].ingreso),
        backgroundColor: "rgba(34,197,94,0.7)",
      },
      {
        label: "Egresos",
        data: labels.map((l) => groupedByConcepto[l].egreso),
        backgroundColor: "rgba(239,68,68,0.7)",
      },
    ],
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="w-full max-w-4xl bg-white p-6 rounded shadow">
        <h1 className="text-2xl font-bold mb-4 text-center">Reportes</h1>
        <h2 className="text-lg mb-6 text-center">
          Saldo actual: <span className="font-bold">${saldo.toLocaleString()}</span>
        </h2>
        <div className="w-full h-96 mb-6">
          <Bar
            data={data}
            options={{
              responsive: true,
              plugins: {
                legend: { position: "top" as const },
                tooltip: {
                  callbacks: {
                    label: function (context) {
                      let value = context.raw as number;
                      return `$${value.toLocaleString()}`;
                    },
                  },
                },
              },
              scales: {
                y: {
                  ticks: {
                    callback: function (value) {
                      return `$${Number(value).toLocaleString()}`;
                    },
                  },
                },
              },
            }}
          />
        </div>
        <div className="flex justify-center">
          <CSVLink
            data={movimientos}
            filename={`reporte_movimientos_${new Date().toISOString()}.csv`}
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Descargar CSV
          </CSVLink>
        </div>
      </div>
    </div>
  );
}

"use client";

import { getSession, useSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/api/auth/signin");
    } else if (session?.user?.role) {
      setRole(session.user.role);
    }
  }, [status, session, router]);

  if (status === "loading") return <div>Cargando...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Bienvenido, {session?.user?.name}</h1>
      <div className="space-x-4 mb-6">
        <button
          onClick={() => router.push("/transactions")}
          className="px-4 py-2 bg-green-500 text-white rounded"
        >
          Movimientos
        </button>

        {role === "ADMIN" && (
          <>
            <button
              onClick={() => router.push("/users")}
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              Usuarios
            </button>
            <button
              onClick={() => router.push("/reports")}
              className="px-4 py-2 bg-purple-500 text-white rounded"
            >
              Reportes
            </button>
          </>
        )}

        <button
          onClick={() => signOut({ callbackUrl: "/api/auth/signin" })}
          className="px-4 py-2 bg-red-500 text-white rounded"
        >
          Cerrar sesión
        </button>
      </div>

      <p className="text-gray-600">
        Use los botones arriba para navegar entre las secciones según su rol.
      </p>
    </div>
  );
}

"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function Home() {
  const router = useRouter();
  const { data: session, status } = useSession();

  if (status === "unauthenticated") {
    router.push("/api/auth/signin");
    return null;
  }

  const isAdmin = session?.user?.role === "ADMIN";

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-gray-100 text-black flex flex-col items-center p-4">
        {/* Logo arriba */}
        <div className="mt-4 mb-8">
          <Image
            src="/Prevalentware logo.png"
            alt="Logo"
            width={180}
            height={50}
          />
        </div>

        {/* Botones centrados verticalmente */}
        <div className="flex flex-col justify-center flex-1 space-y-4">
          <button
            onClick={() => router.push("/transactions")}
            className="w-48 px-4 py-2 bg-gray-300 hover:bg-gray-200 rounded text-center"
          >
            Ingresos y Egresos
          </button>

          {isAdmin && (
            <>
              <button
                onClick={() => router.push("/users")}
                className="w-48 px-4 py-2 bg-gray-300 hover:bg-gray-200 rounded text-center"
              >
                Usuarios
              </button>

              <button
                onClick={() => router.push("/reports")}
                className="w-48 px-4 py-2 bg-gray-300 hover:bg-gray-200 rounded text-center"
              >
                Reportes
              </button>
            </>
          )}
        </div>
      </div>

      {/* Contenido principal */}
      <div className="flex-1 flex flex-col items-center justify-center bg-black text-white relative">
        {/* Botones centrales */}
        <div className="flex flex-col md:flex-row gap-6 items-center justify-center flex-1">
          <button
            onClick={() => router.push("/transactions")}
            className="w-48 h-48 bg-white text-black shadow-lg rounded-lg flex items-center justify-center text-center font-bold text-lg hover:bg-gray-200 transition"
          >
            Sistema de gestión de ingresos y gastos
          </button>

          {isAdmin && (
            <>
              <button
                onClick={() => router.push("/users")}
                className="w-48 h-48 bg-white text-black shadow-lg rounded-lg flex items-center justify-center text-center font-bold text-lg hover:bg-gray-200 transition"
              >
                Gestión de usuarios
              </button>

              <button
                onClick={() => router.push("/reports")}
                className="w-48 h-48 bg-white text-black shadow-lg rounded-lg flex items-center justify-center text-center font-bold text-lg hover:bg-gray-200 transition"
              >
                Reportes
              </button>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="w-full mt-auto">
          <Image
            src="/footer.jpg"
            alt="Footer"
            width={0}
            height={0}
            sizes="100vw"
            className="w-full h-48 object-cover"
          />
        </div>
      </div>
    </div>
  );
}

"use client";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";

export default function Home() {
  const router = useRouter();
  const { data: session, status } = useSession();

  if (status === "unauthenticated") {
    router.push("/api/auth/signin");
    return null;
  }

  const isAdmin = session?.user?.role === "ADMIN";

  return (
    <Layout>
      <div className="flex-1 bg-black flex flex-col">
        {/* Contenedor de botones centrado vertical y horizontalmente */}
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col md:flex-row gap-8 items-center justify-center px-4">
            <Button
              variant="card"
              onClick={() => router.push("/transactions")}
              className="w-64 h-64 text-xl"
            >
              Sistema de gestión de ingresos y gastos
            </Button>

            {isAdmin && (
              <>
                <Button
                  variant="card"
                  onClick={() => router.push("/users")}
                  className="w-64 h-64 text-xl" 
                >
                  Gestión de usuarios
                </Button>

                <Button
                  variant="card"
                  onClick={() => router.push("/reports")}
                  className="w-64 h-64 text-xl" 
                >
                  Reportes
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

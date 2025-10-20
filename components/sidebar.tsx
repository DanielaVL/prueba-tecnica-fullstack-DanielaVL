import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "./ui/button";

export function Sidebar() {
  const router = useRouter();
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === "ADMIN";

  return (
    <div className="w-64 bg-gray-100 text-black flex flex-col items-center p-4">
      <div className="mt-4 mb-8">
        <Image
          src="/Prevalentware logo.png"
          alt="Logo"
          width={180}
          height={50}
        />
      </div>

      <div className="flex flex-col justify-center flex-1 space-y-4">
        <Button
          variant="menu"
          onClick={() => router.push("/transactions")}
        >
          Ingresos y Egresos
        </Button>

        {isAdmin && (
          <>
            <Button
              variant="menu"
              onClick={() => router.push("/users")}
            >
              Usuarios
            </Button>

            <Button
              variant="menu"
              onClick={() => router.push("/reports")}
            >
              Reportes
            </Button>
          </>
        )}
      </div>
    </div>
  );
}

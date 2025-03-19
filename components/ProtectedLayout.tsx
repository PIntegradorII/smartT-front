"use client"; // Necesario porque usa useEffect y useState

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Loading from "@/components/ui/loading";

export default function ProtectedLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("access_token");

    if (!token) {
      router.push("/login"); // Redirige al login si no hay token
    } else {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return <Loading />; // Muestra el spinner mientras se valida la sesión
  }

  return <>{children}</>;
}

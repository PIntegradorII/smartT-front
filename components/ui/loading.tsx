"use client"; // Asegura que se ejecute solo en el cliente

import dynamic from "next/dynamic";
import { useLoading } from "@/app/context/LoadingContext";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false }); // Desactiva SSR
import dumbbellAnimation from "@/public/images/dumbbell.json"; // Asegúrate de que la ruta sea correcta

const Loading = () => {
  const { isLoading } = useLoading();

  if (!isLoading) return null; // No muestra nada si no está cargando

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="w-24 h-24">
        <Lottie animationData={dumbbellAnimation} loop />
      </div>
    </div>
  );
};

export default Loading;

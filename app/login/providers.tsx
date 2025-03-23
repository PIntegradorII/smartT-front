"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { auth, provider, signInWithPopup } from "@/services/login/firebase";
import { signInWithGoogleBackend } from "@/services/login/authService";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Auth, signOut } from "firebase/auth";

type User = {
  id: string;
  email: string;
  name: string;
  avatar?: string;
};

type AuthContextType = {
  user: User | null;
  signInWithGoogle: () => Promise<void>;
  signOutUser: () => Promise<void>;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Persistir usuario desde localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Guardar usuario en localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    }
  }, [user]);

  const signInWithGoogle = async () => {
    setIsLoading(true);
    try {
      const result = await signInWithPopup(auth, provider);
      const credential = result.user;
      const token = await credential.getIdToken();
  
      // Enviar token a backend
      const backendResponse = await signInWithGoogleBackend(token);
      // Guardar el token y la ruta en cookies
      Cookies.set("access_token", backendResponse.access_token, { expires: 1, path: "/" });
      Cookies.set("ruta", backendResponse.ruta.toString(), { expires: 1, path: "/" });
      // Guardar datos del usuario
      const userData = {
        id: credential.uid,
        email: credential.email || '',
        name: credential.displayName || '',
        avatar: credential.photoURL ?? undefined,
      };
      localStorage.setItem("user", JSON.stringify(userData));

      // Redirigir según la ruta del backend
      router.push(backendResponse.ruta === 1 ? "/dashboard" : "/datos-fisicos");
  
      toast.success(`Bienvenido a SmartTrainer, ${credential.displayName}!`);
    } catch (error) {
      console.error("Error en la autenticación:", error);
      toast.error("Hubo un error con la autenticación.");
    } finally {
      setIsLoading(false);
    }
  };
  
  

  const signOutUser = async () => {
    setIsLoading(true);
  
    try {
      if (!auth) {
        throw new Error("Firebase Auth no está disponible.");
      }
  
      await signOut(auth); // Llamar correctamente a signOut de Firebase
      setUser(null);
  
      // Eliminar token de cookies y limpiar localStorage
      Cookies.remove("access_token");
      localStorage.removeItem("user");
  
      await router.push("/"); // Asegurar que la navegación se complete
    } catch (error) {
      console.error("❌ Error al cerrar sesión:", error);
      toast.error("Hubo un problema al cerrar sesión.");
    } finally {
      setIsLoading(false);
    }
  };
  
  

  return (
    <AuthContext.Provider value={{ user, signInWithGoogle, signOutUser, isLoading }}>
      {children}
      <ToastContainer />
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
  }
  return context;
};

"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth, provider, signInWithPopup, signOut } from "@/services/login/firebase";
import { signInWithGoogleBackend } from "@/services/login/authService";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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

  // Persist user data in localStorage (optional)
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Effect to store the user in localStorage when it changes
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
  
      // Guardar el token en localStorage para que persista entre recargas
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify({
        id: credential.uid,
        email: credential.email || '',
        name: credential.displayName || '',
        avatar: credential.photoURL ?? undefined,
      }));
      console.log(credential.uid)
      // Guardar el tiempo de expiración del token (por ejemplo, 1 hora de expiración)
      const expirationTime = Date.now() + 3600000; // 1 hora de expiración
      localStorage.setItem("tokenExpiration", expirationTime.toString());
  
      // Redirigir al dashboard
      router.push("/datos-fisicos");
  
      toast.success(`Bienvenido a FitPro, ${credential.displayName}!`);
    } catch (error) {
      console.error("Error en el proceso de autenticación:", error);
      toast.error("Hubo un error con la autenticación.");
    } finally {
      setIsLoading(false);
    }
  };
  

  const signOutUser = async () => {
    setIsLoading(true);
    try {
      await signOut(auth);
      setUser(null);
      setTimeout(() => router.push("/"), 300);
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
      <ToastContainer /> {/* Este contenedor de notificaciones debería estar solo una vez en la aplicación */}
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

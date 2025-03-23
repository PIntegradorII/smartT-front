const API_URL = process.env.REACT_APP_API_URL || "http://127.0.0.1:8000";
import axios from "axios";
interface ApiResponse {
  data: number; // Ajusta este tipo según el tipo real de `response.data` que esperas recibir
}
export const signInWithGoogleBackend = async (token: string) => {
  try {
    const response = await fetch(`${API_URL}/v1/auth/google-login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token }), // Enviamos el token
    });

    if (!response.ok) {
      throw new Error("Error al iniciar sesión con Google");
    }
    const data = await response.json();
    // Guardar el JWT en localStorage
    localStorage.setItem("access_token", data.access_token);

    return data; // Puedes usar el token cuando sea necesario
  } catch (error) {
    console.error("Error en el login:", error);
    throw error;
  }
};

export const signOutBackend = async () => {
  const API_URL = process.env.REACT_APP_API_URL || "http://127.0.0.1:8000";
  const token = localStorage.getItem("access_token");
  try {
    if (token) {
      const response = await fetch(`${API_URL}/v1/auth/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Error al cerrar sesión");
      }
    }
  } catch (error) {
    console.error("Error en el logout:", error);
  } finally {
    localStorage.removeItem("access_token"); // Se elimina siempre
  }
};
export const getID = async (google_id: string): Promise<number> => {
  const response: ApiResponse = await axios.get(`${API_URL}/v1/auth/user_id/${google_id}`);
  return response.data;
};
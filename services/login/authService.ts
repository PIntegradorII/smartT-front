import api from "../../app/services/api"; // Importa la instancia de Axios

// Iniciar sesión con Google
export const signInWithGoogleBackend = async (token: string) => {
  try {
    const response = await api.post("/auth/google-login", { token });

    // Guardar el JWT en localStorage
    localStorage.setItem("access_token", response.data.access_token);

    return response.data;
  } catch (error) {
    console.error("❌ Error en el login:", error);
    throw error;
  }
};

// Cerrar sesión en el backend
export const signOutBackend = async () => {
  try {
    const token = localStorage.getItem("access_token");

    if (token) {
      await api.post("/auth/logout", null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    }
  } catch (error) {
    console.error("❌ Error en el logout:", error);
  } finally {
    localStorage.removeItem("access_token"); // Elimina el token siempre
  }
};

// Obtener ID de usuario por Google ID
export const getID = async (google_id: any) => {
  try {
    const response = await api.get(`/auth/user_id/${google_id}`);
    return response.data; // Devuelve directamente el ID
  } catch (error) {
    console.error("❌ Error al obtener el ID:", error);
    throw error;
  }
};

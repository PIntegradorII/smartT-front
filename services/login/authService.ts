const API_URL = process.env.REACT_APP_API_URL || "http://127.0.0.1:8000";

export const signInWithGoogleBackend = async (token: string) => {
  console.log("🔥 Enviando token al backend:", token);
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
    console.log("🔥 Resultado de la autenticación en el backend:", data);
    // Guardar el JWT en localStorage
    localStorage.setItem("access_token", data.access_token);

    return data; // Puedes usar el token cuando sea necesario
  } catch (error) {
    console.error("Error en el login:", error);
    throw error;
  }
};

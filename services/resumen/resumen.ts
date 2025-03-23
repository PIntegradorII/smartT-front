export const getWeeklyExercises = async (googleId: string) => {
    const API_URL = process.env.REACT_APP_API_URL || "http://127.0.0.1:8000";
  
    try {
      const response = await fetch(`${API_URL}/v1/log_exercises/exercise/weekly/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ google_id: googleId }),
      });
  
      if (!response.ok) {
        throw new Error(`Error en la solicitud: ${response.statusText}`);
      }
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("❌ Error al obtener ejercicios semanales:", error);
      return null;
    }
  };
  
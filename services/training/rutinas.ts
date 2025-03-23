export const getTrainingPlanByGoogleId = async (googleId: string) => {
    const API_URL = process.env.REACT_APP_API_URL || "https://smartt-back.onrender.com";
  
    try {
      const response = await fetch(`${API_URL}/v1/training/training-plan/google/${googleId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      if (!response.ok) {
        throw new Error(`Error en la solicitud: ${response.statusText}`);
      }
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("❌ Error al obtener el plan de entrenamiento:", error);
      return null;
    }
  };
  
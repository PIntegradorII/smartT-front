import api from "../../app/services/api";

// Obtener datos completos del usuario por su ID
export const getUserData = async (userId) => {
  try {
    // Obtener datos básicos del usuario
    const userResponse = await api.get(`/users/users/${userId}`);
    const user = userResponse.data;
    console.log(user);

    // Obtener datos de salud
    const healthResponse = await api.get(`/health/health/user/${userId}`);
    const healthData = healthResponse.data;
    console.log(healthData);

    // Obtener datos personales
    const personalResponse = await api.get(`/personal_data/personal_data/user/${userId}`);
    const personalData = personalResponse.data;



    // Estructurar la respuesta final
    return {
      nombre: user.name,
      peso: 60,
      altura: 1.6,
      sexo: personalData.genero,
      condiciones_medicas : healthData.tiene_condiciones === "si" ? [healthData.detalles_condiciones, healthData.lesiones] : ["Ninguna"],
      meta_entrenamiento: "Perder peso",
    };
  } catch (error) {
    console.error("Error al obtener los datos del usuario:", error);
    throw error;
  }
};


// Crear plan de entrenamiento con los datos del usuario
export const createPlan = async (userId) => {
    try {
      // Obtener datos del usuario
      const userInfo = await getUserData(userId);
  
      // Enviar los datos al backend para generar el plan
      const response = await api.get("/training/training-plan", {
        params: userInfo, // Enviar los datos como parámetros de consulta
      });
  
      if (!response.data) {
        throw new Error("No se pudo generar el plan de entrenamiento");
      }
  
    //   console.log("Plan de entrenamiento generado:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error en createPlan:", error);
      throw error;
    }
  };
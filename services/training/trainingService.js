import api from "../../app/services/api";

// Obtener datos completos del usuario por su ID
export const getUserData = async (userId) => {
  try {
    // Obtener datos básicos del usuario
    const userResponse = await api.get(`/users/users/${userId}`);
    const user = userResponse.data;

    // Obtener datos de salud
    const healthResponse = await api.get(`/health/health/user/${userId}`);
    const healthData = healthResponse.data;

    // Obtener datos personales
    const personalResponse = await api.get(`/personal_data/personal_data/user/${userId}`);
    const personalData = personalResponse.data;

    // Obtener datos físicos
    const physicalResponse = await api.get(`/physical/physical_data/user/${userId}`);
    const physicalData = physicalResponse.data;  


    // Estructurar la respuesta final
    return {
      nombre: user.name,
      peso: physicalData.peso,
      altura: physicalData.altura,
      sexo: personalData.genero,
      condiciones_medicas : healthData.tiene_condiciones === "si" ? [healthData.detalles_condiciones, healthData.lesiones] : ["Ninguna"],
      meta_entrenamiento: physicalData.objetivo,
    };
  } catch (error) {
    console.error("Error al obtener los datos del usuario:", error);
    throw error;
  }
};


// Crear plan de entrenamiento con los datos del usuario


// Crear plan de entrenamiento con los datos del usuario
// export const createPlan = async (userId) => {
//     try {
//       // Obtener datos del usuario
//       const userInfo = await getUserData(userId);
  
//       // Enviar los datos al backend para generar el plan
//       const response = await api.get("/training/training-plan", {
//         params: userInfo, // Enviar los datos como parámetros de consulta
//       });
  
//       if (!response.data) {
//         throw new Error("No se pudo generar el plan de entrenamiento");
//       }
  
//     //   console.log("Plan de entrenamiento generado:", response.data);
//       return response.data;
//     } catch (error) {
//       console.error("Error en createPlan:", error);
//       throw error;
//     }
//   };

  export const getDailyPlan = async (userId) => {
    try {
      const response = await api.get("/training/daily-training-plan", {
        params: { user_id: userId },
      });
      return response.data;
    } catch (error) {
      console.error("Error al obtener la rutina diaria:", error);
      throw error;
    }
  };

  export const regenerateRoutineDay = async (user_id, day, routine) => {
    try {
      const response = await api.post("/training/generate-daily-training", 
        {
          current_routine: routine  // Se envía en el body
        },
        {
          params: { day_of_week: day },  // Se envía como query parameter
        }
      );
      const newRoutine = response.data.new_routine.current_routine;
      await updateRoutine(user_id, day, newRoutine);
    } catch (error) {
      console.error("Error al regenerar la rutina:", error.response?.data || error.message);
    }
  };


  export const updateRoutine = async (userId, day, routine) => {
    try {
        const response = await api.put(`/training/update-routine`, 
            routine, // Aquí enviamos un objeto con la rutina
            {
                params: {  
                    user_id: userId,
                    day_of_week: day
                }
            }
        );

        console.log("Rutina actualizada:", response);
        return response.data;
    } catch (error) {
        console.error("Error al actualizar la rutina:", error.response?.data || error.message);
    }
};
// services/exercises/exerciseApi.js

export const getExerciseGif = async (name) => {
  const url = `https://exercisedb.p.rapidapi.com/exercises/name/${encodeURIComponent(name)}?offset=0&limit=1`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "x-rapidapi-key": "52ff245a5bmsh8b115c1a1d680a8p17d983jsnc796ce1750a5",
        "x-rapidapi-host": "exercisedb.p.rapidapi.com",
      },
    });

    if (!response.ok) {
      throw new Error("No se pudo obtener el GIF del ejercicio");
    }

    const data = await response.json();
    return data[0]?.gifUrl || null;
  } catch (error) {
    console.error("Error obteniendo el GIF:", error);
    return null;
  }
};

  
export const createPlan = async (userId) => {
  try {
    // Obtener datos del usuario
    const userInfo = await getUserData(userId);

    // Obtener el plan de entrenamiento generado
    const response = await api.get("/training/training-plan", {
      params: userInfo, // Enviar los datos como parámetros de consulta
    });
    
    if (!response.data) {
      throw new Error("No se pudo generar el plan de entrenamiento");
    }
    
    const trainingPlan = {
      user_id: userId,  // Agrega el user_id esperado por el backend
      ...response.data, // Mantiene los días de la semana como están
    };
    
    console.log("Datos enviados en POST:", trainingPlan);

    // Guardar el plan de entrenamiento en el backend
    const saveResponse = await api.post("/training/training-plan", trainingPlan);

    if (!saveResponse.data) {
      throw new Error("No se pudo guardar el plan de entrenamiento");
    }

    console.log("Plan de entrenamiento guardado:", saveResponse.data);
    return saveResponse.data;
  } catch (error) {
    console.error("Error en createPlan:", error);
    throw error;
  }
};
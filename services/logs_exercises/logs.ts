import api from "../../app/services/api"; // Importa la instancia de Axios

// Registrar un ejercicio
export const logExercise = async (data: any) => {
  try {
    const response = await api.post("/log_exercises/exercise", data);
    return response.data;
  } catch (error) {
    console.error("❌ Error logging exercise:", error);
    throw error;
  }
};

// Obtener el registro de ejercicios diarios
export const getDailyExerciseLog = async (user_id: number, date: string) => {
  try {
    const response = await api.get("/log_exercises/exercise/logs", {
      params: { user_id, date },
    });
    return response.data;
  } catch (error) {
    console.error("❌ Error fetching daily exercise log:", error);
    throw error;
  }
};

// Actualizar el estado de un log de ejercicio
export const updateLogStatus = async (log_id: any, completed: any) => {
  try {
    const response = await api.patch(`/log_exercises/exercise/${log_id}`, { completed });
    return response.data;
  } catch (error) {
    console.error("❌ Error updating log status:", error);
    throw error;
  }
};

// Actualizar logs por usuario y fecha
export const updateLogByUserAndDate = async (user_id: number | null, date: string, completed: number) => {
  try {
    const response = await api.patch("/log_exercises/exercise/logs/", null, {
      params: { user_id, date, completed },
    });
    return response.data;
  } catch (error) {
    console.error("❌ Error updating log by user and date:", error);
    throw error;
  }
};

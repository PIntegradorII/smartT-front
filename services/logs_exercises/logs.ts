import axios from "axios";

const BASE_URL = "https://smartt-back.onrender.com/v1";

export const logExercise = async (data: { user_id: number | null; date: string; completed: boolean }) => {
    try {
      const response = await axios.post(`${BASE_URL}/log_exercises/exercise`, data);
      return response.data;
    } catch (error) {
      console.error("Error logging exercise:", error);
      throw error;
    }
  };


  export const getDailyExerciseLog = async (user_id: number | null, date: string) => {
    try {
      const response = await axios.get(`${BASE_URL}/log_exercises/exercise/logs`, {
        params: { user_id, date },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching daily exercise log:", error);
      throw error;
    }
  };
  
export const updateLogStatus = async (log_id: number, completed: boolean) => {
    try {
      const response = await axios.patch(`${BASE_URL}/log_exercises/exercise/${log_id}`, { completed });
      return response.data;
    } catch (error) {
      console.error("Error updating log status:", error);
      throw error;
    }
  };
  
  export const updateLogByUserAndDate = async (
    user_id: number | null,
    date: string,
    completed: number
  ) => {
    try {
      const response = await axios.patch(
        `${BASE_URL}/log_exercises/exercise/logs/`,
        null, // No hay cuerpo en la solicitud
        {
          params: { user_id, date, completed },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error updating log by user and date:", error);
      throw error;
    }
  };
  
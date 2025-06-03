
// services/barcode/barcode_service.ts
import api from "@/app/services/api"

export async function SendBarcode(file, userId) {
  const userInfo = await getUserData(userId);

  console.log("Datos del usuario:", userInfo);
  const formData = new FormData()
  formData.append("file", file)
  formData.append("objetivo", userInfo.meta_entrenamiento)

  const response = await api.post("/barcode/escaneo-nutricional", formData, {
    headers: { "Content-Type": "multipart/form-data" }
  })

  return response.data
}


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
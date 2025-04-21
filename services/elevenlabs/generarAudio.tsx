// generarAudio.tsx

export const generarAudioResumen = async (
  rutina: any,
  usuario: string,
  dia: string
): Promise<string> => {
  const primerNombre = usuario.split(" ")[0];
  let texto = `¡Hola ${primerNombre}! Aquí tienes un resumen de tu rutina para el día ${dia}. `;

  if (!rutina?.ejercicios || rutina.ejercicios.length === 0) {
    texto += "Hoy no tienes ejercicios asignados. ¡Aprovecha para descansar o hacer movilidad ligera!";
  } else {
    texto += "Vas a trabajar con los siguientes ejercicios: ";
    rutina.ejercicios.forEach((ej: any, index: number) => {
      texto += `Ejercicio ${index + 1}: ${ej.ejercicio}, con ${ej.series} series de ${ej.repeticiones} repeticiones. `;
    });
    texto += "Recuerda calentar bien antes de comenzar. ¡Éxitos en tu entrenamiento!";
  }

  const apiKey = 'OgOJwJKXN9SDEcZAIXoSz1WZjom5gL3WTeB4IDZlLRsH'; // ⚠️ Solo para pruebas. NO en producción.
  const url = 'https://api.au-syd.text-to-speech.watson.cloud.ibm.com/v1/synthesize?voice=es-LA_SofiaV3Voice';

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: 'Basic ' + btoa('apikey:' + apiKey),
        'Content-Type': 'application/json',
        Accept: 'audio/mp3',
      },
      body: JSON.stringify({ text: texto }),
    });

    if (!response.ok) {
      throw new Error(`IBM Watson error: ${response.statusText}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const blob = new Blob([arrayBuffer], { type: 'audio/mp3' });
    const audioURL = URL.createObjectURL(blob);
    return audioURL;
  } catch (error) {
    console.error('Error generando audio:', error);
    throw error;
  }
};

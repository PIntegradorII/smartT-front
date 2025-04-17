import { ElevenLabsClient } from "elevenlabs";

const client = new ElevenLabsClient({
  apiKey: "sk_bbfa19d703aeddf2ba3ddba8a42766b0040a8ad975675d20"
});

export const generarAudioResumen = async (rutina: any, usuario: string, dia: string): Promise<string> => {
  const primerNombre = usuario.split(" ")[0];
  let texto = `¡Hola ${primerNombre}! Aquí tienes un resumen de tu rutina para el día ${dia}. `;

  if (rutina.ejercicios.length === 0) {
    texto += "Hoy no tienes ejercicios asignados. ¡Aprovecha para descansar o hacer movilidad ligera!";
  } else {
    texto += "Vas a trabajar con los siguientes ejercicios: ";
    rutina.ejercicios.forEach((ej: any, index: number) => {
      texto += `Ejercicio ${index + 1}: ${ej.ejercicio}, con ${ej.series} series de ${ej.repeticiones} repeticiones. `;
    });
    texto += "Recuerda calentar bien antes de comenzar. ¡Éxitos en tu entrenamiento!";
  }

  const stream = await client.textToSpeech.convert("21m00Tcm4TlvDq8ikWAM", {
    output_format: "mp3_44100_128",
    text: texto,
    model_id: "eleven_multilingual_v2"
  });

  const chunks: Uint8Array[] = [];
  for await (const chunk of stream) {
    chunks.push(chunk);
  }

  const blob = new Blob(chunks, { type: "audio/mpeg" });
  const url = URL.createObjectURL(blob);
  return url;
};
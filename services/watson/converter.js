import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';

// Configuración global de FFmpeg
const ffmpeg = new FFmpeg();

/**
 * Inicializa FFmpeg con los core wasm
 */
const initializeFFmpeg = async () => {
  try {
    if (!ffmpeg.loaded) {
      const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd';
      
      await ffmpeg.load({
        coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
        wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
      });
      
      console.log('FFmpeg initialized successfully');
    }
  } catch (error) {
    console.error('Error initializing FFmpeg:', error);
    throw new Error('Failed to initialize FFmpeg');
  }
};

/**
 * Convierte un Blob de audio a formato WAV
 */
export const convertAudioToWav = async (audioBlob) => {
  try {
    // Asegurar que FFmpeg esté inicializado
    if (!ffmpeg.loaded) {
      await initializeFFmpeg();
    }

    // Configuración de nombres de archivo
    const inputName = 'input.webm';
    const outputName = 'output.wav';

    // Escribir archivo de entrada
    await ffmpeg.writeFile(inputName, await fetchFile(audioBlob));

    // Ejecutar conversión
    await ffmpeg.exec([
      '-i', inputName,       // Archivo de entrada
      '-acodec', 'pcm_s16le', // Códec PCM 16-bit
      '-ac', '1',             // Canal mono
      '-ar', '16000',         // Tasa de muestreo 16kHz
      '-f', 'wav',            // Forzar formato WAV
      outputName              // Archivo de salida
    ]);

    // Leer y devolver el resultado
    const data = await ffmpeg.readFile(outputName);
    return new Blob([data], { type: 'audio/wav' });

  } catch (error) {
    console.error('Error in audio conversion:', {
      error,
      blobInfo: {
        size: audioBlob.size,
        type: audioBlob.type
      }
    });
    throw new Error('Audio conversion failed');
  }
};

// Exportar función de inicialización si se necesita llamar explícitamente
export { initializeFFmpeg };
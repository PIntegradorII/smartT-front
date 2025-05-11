export const generarAudioProgresoFisico = async (
    mensaje: string,
    usuario: string
  ): Promise<string> => {
    const primerNombre = usuario.split(" ")[0];
    const texto = `Hola ${primerNombre}. ${mensaje}`;
  
    const apiKey = 'OgOJwJKXN9SDEcZAIXoSz1WZjom5gL3WTeB4IDZlLRsH'; // tu API key de IBM aquí
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
  
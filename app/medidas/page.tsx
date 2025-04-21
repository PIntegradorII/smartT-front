"use client"

import { useEffect, useState } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowDown, ArrowUp, BarChart3, LineChart, Scale, TrendingUp } from "lucide-react"
import { getPhysicalHistory } from "@/services/physical_history/physical_historyService"
import { getID } from "@/services/login/authService";
import { getPhysicalDataById} from "@/services/user/physical_data";
import { generarTextoMedidas } from "@/services/physical_history/physical_historyService";
import { generarAudioProgresoFisico } from "@/services/elevenlabs/generarAudioProgresoFisico";


export default function ProgresoPage() {
  interface PhysicalRecord {
    created_at: string
    peso: number
    altura: number
    imc: number
    pecho: number
    cintura: number
    brazos: number
    piernas: number
    objetivo: string
  }

  const [history, setHistory] = useState<PhysicalRecord[]>([])
  const [latest, setLatest] = useState<PhysicalRecord | null>(null)
  const [physical, setPhysical] = useState<PhysicalRecord | null>(null)
  const [question, setQuestion] = useState<string>(""); // Estado para la pregunta
  const [message, setResponse] = useState<string>(""); // Estado para la pregunta
  const [error, setError] = useState(""); // Estado para el mensaje de error
  const [loadingAudio, setLoadingAudio] = useState(false);


  interface UserData {
    id: string;
    name: string;
    email: string;
    // Add other fields as needed
  }
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
  const fetchHistory = async () => {
    const storedUser = localStorage.getItem("user");
    const parsedUser = storedUser ? JSON.parse(storedUser) : null;

    if (!parsedUser?.id) return;

    setUserData(parsedUser); // Guarda todo el user, no solo el id
    const data = await getPhysicalHistory(parsedUser.id); // Usa directamente el id aquí

    const fetchedId = await getID(parsedUser.id);
    // console.log("ID de usuario:", fetchedId); // Verifica el ID obtenido

    const physical = await getPhysicalDataById(fetchedId);
    console.log("Datos físicos:", physical);
    setPhysical(physical); // <- aquí lo guardas en el estado

    const sortedData = (data || []).sort(
      (a: { created_at: string | number | Date }, b: { created_at: string | number | Date }) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    setHistory(sortedData);
    if (sortedData.length > 0) {
      setLatest(sortedData[0]); // El más reciente
    }
  };

  fetchHistory();
}, []);

const handleQuestionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  setQuestion(event.target.value); // Actualiza el estado con la pregunta
};

const handleSubmit = async () => {

  setLoadingAudio(true); // ⏳ empieza la carga

  if (!question.trim()) {
    setError("El campo no puede estar vacío"); // Muestra un mensaje si el campo está vacío
    return;
  }

  // Verifica si tenemos los datos necesarios
  if (!physical || !userData) {
    console.log("Faltan datos para enviar al backend");
    return;
  }

  const processResponse = (respuesta: string): string => {
    try {
      if (!respuesta) return "No se recibió una respuesta válida del servidor.";
  
      // Elimina el contenido entre <think>...</think>
      const cleanedMessage = respuesta.replace(/<think>[\s\S]*?<\/think>/g, '').trim();
  
      return cleanedMessage || "No se encontró una respuesta clara.";
    } catch (error) {
      console.error("Error al procesar la respuesta:", error);
      return "Ocurrió un error al procesar la respuesta.";
    }
  };
  
  // Estructura el historial con los campos faltantes
  const finalHistory = history.length === 0 ? [{
    peso: physical.peso,
    altura: physical.altura,
    imc: physical.imc,
    cintura: physical.cintura,
    pecho: physical.pecho,
    brazos: physical.brazos,
    piernas: physical.piernas,
    created_at: new Date().toISOString(),  // Fecha actual para el historial
    physical_id: 0,  // Asignamos un ID temporal o 0 si es necesario
    objetivo: physical.objetivo,  // Asumimos que 'objetivo' se encuentra en physical
    archived_at: new Date().toISOString(),  // Fecha actual para archived_at
    estado: 1  // Establecemos un estado por defecto (puede ser 0 o 1, según sea necesario)
  }] : history;

  // Estructura la entrada en el formato adecuado
  const requestData = {
    current_data: {
      user_id: 1,  // ID del usuario
      peso: physical.peso,
      altura: physical.altura,
      imc: physical.imc,
      cintura: physical.cintura,
      pecho: physical.pecho,
      brazos: physical.brazos,
      piernas: physical.piernas,
      objetivo: physical.objetivo  // Suponiendo que el objetivo es fijo por ahora
    },
    historial: finalHistory.map(record => ({
      peso: record.peso,
      altura: record.altura,
      imc: record.imc,
      cintura: record.cintura,
      pecho: record.pecho,
      brazos: record.brazos,
      piernas: record.piernas,
      physical_id: 1,  // ID del registro físico
      created_at: record.created_at,
      objetivo: record.objetivo,  // Asegúrate de que objetivo esté presente
      archived_at: record.created_at,  // Fecha de archivo
      estado: 1  // Estado del registro
    })),
    pregunta: question // Aquí se usa la pregunta dinámica
  };

  let message = ""; // 👈 declarar aquí
  // Muestra la estructura por consola para ver cómo se enviará
  try {
    const rawResponse = await generarTextoMedidas(requestData);
    message = processResponse(rawResponse);
    setResponse(message);
    console.log("Mensaje procesado:", message);
  } catch (error) {
    console.error("Error al obtener la respuesta del backend:", error);
    setLoadingAudio(false);
    return;
  }

  const usuario = userData?.name || "Usuario";
  const audioUrl = await generarAudioProgresoFisico(message, usuario); // ✅ aquí ya existe `message`;

  // Resetea la pregunta
  setQuestion("");
  setError("");
  setLoadingAudio(false); // ⏳ empieza la carga

// Reproducir audio (opcional)
  const audio = new Audio(audioUrl);
  audio.play();
};

  return (
    <MainLayout>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Tu progreso</h1>
          <p className="text-muted-foreground">Seguimiento de tus métricas y evolución.</p>
        </div>

        {/* Métricas principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Peso corporal</p>
                  <div className="flex items-baseline">
                    <h3 className="text-2xl font-bold">{physical?.peso || "--"} kg</h3>
                    <span className="ml-2 text-sm font-medium text-success flex items-center">
                      {latest?.peso}
                      {latest && physical?.peso !== undefined && (
                        (physical.peso ?? 0) > (latest.peso ?? 0) ? (
                          <ArrowUp className="h-3 w-3 inline text-green-500 ml-1" />
                        ) : (physical.peso ?? 0) < (latest.peso ?? 0) ? (
                          <ArrowDown className="h-3 w-3 inline text-red-500 ml-1" />
                        ) : null
                      )}
                    </span>
                  </div>
                </div>
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Scale className="h-5 w-5 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">IMC</p>
                  <div className="flex items-baseline">
                    <h3 className="text-2xl font-bold">{physical?.imc || "--"}</h3>
                    <span className="ml-2 text-sm font-medium text-success flex items-center">
                    {latest?.imc}
                      {latest && physical?.imc !== undefined && (
                        (physical.imc ?? 0) > (latest.imc ?? 0) ? (
                          <ArrowUp className="h-3 w-3 inline text-green-500 ml-1" />
                        ) : (physical.imc ?? 0) < (latest.imc ?? 0) ? (
                          <ArrowDown className="h-3 w-3 inline text-red-500 ml-1" />
                        ) : null
                      )}
                    </span>
                  </div>
                </div>
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <LineChart className="h-5 w-5 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Pecho</p>
                  <div className="flex items-baseline">
                    <h3 className="text-2xl font-bold">{physical?.pecho || "--"} cm</h3>
                    <span className="ml-2 text-sm font-medium text-success flex items-center">
                    {latest?.pecho}
                      {latest && physical?.pecho !== undefined && (
                        (physical.pecho ?? 0) > (latest.pecho ?? 0) ? (
                          <ArrowUp className="h-3 w-3 inline text-green-500 ml-1" />
                        ) : (physical.pecho ?? 0) < (latest.pecho ?? 0) ? (
                          <ArrowDown className="h-3 w-3 inline text-red-500 ml-1" />
                        ) : null
                      )}
                    </span>
                  </div>
                </div>
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <BarChart3 className="h-5 w-5 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Cintura</p>
                  <div className="flex items-baseline">
                    <h3 className="text-2xl font-bold">{physical?.cintura || "--"} cm</h3>
                    <span className="ml-2 text-sm font-medium text-success flex items-center">
                    {latest?.cintura}
                      {latest && physical?.cintura !== undefined && (
                        (physical.cintura ?? 0) > (latest.cintura ?? 0) ? (
                          <ArrowUp className="h-3 w-3 inline text-green-500 ml-1" />
                        ) : (physical.cintura ?? 0) < (latest.cintura ?? 0) ? (
                          <ArrowDown className="h-3 w-3 inline text-red-500 ml-1" />
                        ) : null
                      )}
                    </span>
                  </div>
                </div>
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Historial de mediciones */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Historial de mediciones</CardTitle>
              <CardDescription>Registro de tus mediciones anteriores</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium">Fecha</th>
                    <th className="text-left py-3 px-4 font-medium">Peso</th>
                    <th className="text-left py-3 px-4 font-medium">Altura</th>
                    <th className="text-left py-3 px-4 font-medium">IMC</th>
                    <th className="text-left py-3 px-4 font-medium">Pecho</th>
                    <th className="text-left py-3 px-4 font-medium">Cintura</th>
                    <th className="text-left py-3 px-4 font-medium">Brazos</th>
                    <th className="text-left py-3 px-4 font-medium">Piernas</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((record, index) => (
                    <tr key={index} className="border-b">
                      <td className="py-3 px-4">{new Date(record.created_at).toLocaleDateString()}</td>
                      <td className="py-3 px-4">{record.peso}</td>
                      <td className="py-3 px-4">{record.altura}</td>
                      <td className="py-3 px-4">{record.imc}</td>
                      <td className="py-3 px-4">{record.pecho}</td>
                      <td className="py-3 px-4">{record.cintura}</td>
                      <td className="py-3 px-4">{record.brazos}</td>
                      <td className="py-3 px-4">{record.piernas}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Cuadro de texto para la pregunta */}
        <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Haz una pregunta</CardTitle>
          <CardDescription>Escribe tu pregunta y presiona enviar</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <input
            type="text"
            className="p-4 border rounded-lg"
            value={question}
            onChange={handleQuestionChange}
            placeholder="Escribe tu pregunta aquí"
          />
          {error && <p className="text-red-500">{error}</p>} {/* Muestra el mensaje de error */}
          <button
            onClick={handleSubmit}
            className="w-full p-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
            disabled={loadingAudio}
          >
            {loadingAudio ? "Cargando audio..." : "Enviar Pregunta"}
          </button>
        </div>
      </CardContent>
    </Card>
      </div>
    </MainLayout>
  )
}
function processResponse(respuesta: any) {
  throw new Error("Function not implemented.")
}


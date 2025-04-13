"use client"

import { useEffect, useState } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowDown, ArrowUp, BarChart3, LineChart, Scale, TrendingUp } from "lucide-react"
import { getPhysicalHistory } from "@/services/physical_history/physical_historyService"
import { getID } from "@/services/login/authService";
import { getPhysicalDataById} from "@/services/user/physical_data";

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
  }

  const [history, setHistory] = useState<PhysicalRecord[]>([])
  const [latest, setLatest] = useState<PhysicalRecord | null>(null)
  const [physical, setPhysical] = useState<PhysicalRecord | null>(null)

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
    // console.log("Datos físicos:", physical);
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
      </div>
    </MainLayout>
  )
}

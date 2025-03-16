import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { ArrowDown, ArrowUp, BarChart3, LineChart, Scale, TrendingUp } from "lucide-react"

export default function ProgresoPage() {
  return (
    <MainLayout>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Tu progreso</h1>
          <p className="text-muted-foreground">Seguimiento de tus métricas y evolución.</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <div>
            <h2 className="text-xl font-semibold">Resumen de progreso</h2>
            <p className="text-sm text-muted-foreground">Últimos 30 días</p>
          </div>
          <div className="flex gap-2">
            <Select defaultValue="30">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Seleccionar período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">Últimos 7 días</SelectItem>
                <SelectItem value="30">Últimos 30 días</SelectItem>
                <SelectItem value="90">Últimos 3 meses</SelectItem>
                <SelectItem value="180">Últimos 6 meses</SelectItem>
                <SelectItem value="365">Último año</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Métricas principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Peso corporal</p>
                  <div className="flex items-baseline">
                    <h3 className="text-2xl font-bold">78.5 kg</h3>
                    <span className="ml-2 text-sm font-medium text-success flex items-center">
                      <ArrowDown className="h-3 w-3 mr-1" />
                      2.3%
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
                  <p className="text-sm font-medium text-muted-foreground">Masa muscular</p>
                  <div className="flex items-baseline">
                    <h3 className="text-2xl font-bold">32.1 kg</h3>
                    <span className="ml-2 text-sm font-medium text-success flex items-center">
                      <ArrowUp className="h-3 w-3 mr-1" />
                      1.8%
                    </span>
                  </div>
                </div>
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Grasa corporal</p>
                  <div className="flex items-baseline">
                    <h3 className="text-2xl font-bold">18.2%</h3>
                    <span className="ml-2 text-sm font-medium text-success flex items-center">
                      <ArrowDown className="h-3 w-3 mr-1" />
                      3.5%
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
                  <p className="text-sm font-medium text-muted-foreground">Fuerza (press banca)</p>
                  <div className="flex items-baseline">
                    <h3 className="text-2xl font-bold">85 kg</h3>
                    <span className="ml-2 text-sm font-medium text-success flex items-center">
                      <ArrowUp className="h-3 w-3 mr-1" />
                      5.0%
                    </span>
                  </div>
                </div>
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <LineChart className="h-5 w-5 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Gráficos de progreso */}
        <Card>
          <CardHeader>
            <CardTitle>Evolución de métricas</CardTitle>
            <CardDescription>Seguimiento de tus principales indicadores</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="peso">
              <TabsList className="mb-4">
                <TabsTrigger value="peso">Peso</TabsTrigger>
                <TabsTrigger value="muscular">Masa muscular</TabsTrigger>
                <TabsTrigger value="grasa">Grasa corporal</TabsTrigger>
                <TabsTrigger value="fuerza">Fuerza</TabsTrigger>
              </TabsList>

              <TabsContent value="peso">
                <div className="h-[300px] w-full bg-muted/30 rounded-lg flex items-center justify-center">
                  <div className="text-center p-6">
                    <LineChart className="h-10 w-10 text-primary mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">Gráfico de evolución de peso</h3>
                    <p className="text-sm text-muted-foreground max-w-md mx-auto">
                      Aquí se mostraría un gráfico con la evolución de tu peso corporal a lo largo del tiempo.
                    </p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="muscular">
                <div className="h-[300px] w-full bg-muted/30 rounded-lg flex items-center justify-center">
                  <div className="text-center p-6">
                    <LineChart className="h-10 w-10 text-primary mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">Gráfico de evolución de masa muscular</h3>
                    <p className="text-sm text-muted-foreground max-w-md mx-auto">
                      Aquí se mostraría un gráfico con la evolución de tu masa muscular a lo largo del tiempo.
                    </p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="grasa">
                <div className="h-[300px] w-full bg-muted/30 rounded-lg flex items-center justify-center">
                  <div className="text-center p-6">
                    <LineChart className="h-10 w-10 text-primary mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">Gráfico de evolución de grasa corporal</h3>
                    <p className="text-sm text-muted-foreground max-w-md mx-auto">
                      Aquí se mostraría un gráfico con la evolución de tu porcentaje de grasa corporal a lo largo del
                      tiempo.
                    </p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="fuerza">
                <div className="h-[300px] w-full bg-muted/30 rounded-lg flex items-center justify-center">
                  <div className="text-center p-6">
                    <LineChart className="h-10 w-10 text-primary mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">Gráfico de evolución de fuerza</h3>
                    <p className="text-sm text-muted-foreground max-w-md mx-auto">
                      Aquí se mostraría un gráfico con la evolución de tu fuerza en diferentes ejercicios a lo largo del
                      tiempo.
                    </p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Historial de mediciones */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Historial de mediciones</CardTitle>
              <CardDescription>Registro de tus mediciones anteriores</CardDescription>
            </div>
            <Button variant="outline">Añadir medición</Button>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium">Fecha</th>
                    <th className="text-left py-3 px-4 font-medium">Peso (kg)</th>
                    <th className="text-left py-3 px-4 font-medium">Masa muscular (kg)</th>
                    <th className="text-left py-3 px-4 font-medium">Grasa corporal (%)</th>
                    <th className="text-left py-3 px-4 font-medium">IMC</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="py-3 px-4">13 Mar 2024</td>
                    <td className="py-3 px-4">78.5</td>
                    <td className="py-3 px-4">32.1</td>
                    <td className="py-3 px-4">18.2</td>
                    <td className="py-3 px-4">24.2</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4">06 Mar 2024</td>
                    <td className="py-3 px-4">79.2</td>
                    <td className="py-3 px-4">31.8</td>
                    <td className="py-3 px-4">18.7</td>
                    <td className="py-3 px-4">24.4</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4">28 Feb 2024</td>
                    <td className="py-3 px-4">80.1</td>
                    <td className="py-3 px-4">31.5</td>
                    <td className="py-3 px-4">19.3</td>
                    <td className="py-3 px-4">24.7</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4">21 Feb 2024</td>
                    <td className="py-3 px-4">80.5</td>
                    <td className="py-3 px-4">31.2</td>
                    <td className="py-3 px-4">19.8</td>
                    <td className="py-3 px-4">24.8</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4">14 Feb 2024</td>
                    <td className="py-3 px-4">80.8</td>
                    <td className="py-3 px-4">31.0</td>
                    <td className="py-3 px-4">20.1</td>
                    <td className="py-3 px-4">24.9</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}


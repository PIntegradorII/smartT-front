import { useState, useEffect } from "react";
import {
  getNutritionPlan,

} from "@/services/watson/watson";
import { Button } from "@/components/ui/button";

interface Meal {
  descripcion: string;
  componentes: string[];
}

interface MealCardProps {
  title: string;
  meal: Meal;
}

function MealCard({ title, meal }: MealCardProps) {
  return (
    <div className="border rounded-lg p-4 mb-4 shadow-sm">
      <h3 className="text-lg font-bold mb-2">{title}</h3>
      <p className="text-sm text-gray-600 mb-3">{meal.descripcion}</p>
      <ul className="list-disc pl-5 space-y-1">
        {meal.componentes.map((item, index) => (
          <li key={index} className="text-sm">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
interface DailyNutritionProps {
  google_id: number | null;
}

export default function DailyNutrition({ google_id }: DailyNutritionProps) {
  interface NutritionPlan {
    plan_alimenticio: {
      desayuno: Meal;
      snack_manana: Meal;
      almuerzo: Meal;
      snack_tarde: Meal;
      cena: Meal;
    };
    recomendaciones_generales: string[];
  }

  const [nutritionPlan, setNutritionPlan] = useState<NutritionPlan | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [regenerating, setRegenerating] = useState(false);

  const fetchPlan = async () => {
    try {
      setLoading(true);
      const plan = await getNutritionPlan(google_id);
      setNutritionPlan(plan);
    } catch (err) {
      setError("Error cargando el plan nutricional");
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchPlan();
  }, []);

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        setLoading(true);
        // Obtener google_id del usuario (ejemplo desde localStorage)
        console.log("ID GOOGLE DAILY NUTRITION", google_id);

        const plan = await getNutritionPlan(google_id);
        setNutritionPlan(plan);
      } catch (err) {
        setError("Error cargando el plan nutricional");
      } finally {
        setLoading(false);
      }
    };

    fetchPlan();
  }, []);

  if (loading) {
    return <div className="p-4 text-center">Cargando plan nutricional...</div>;
  }

  if (error) {
    return <div className="p-4 text-center text-red-500">{error}</div>;
  }

  if (!nutritionPlan) {
    return (
      <div className="p-4 text-center">No hay plan nutricional disponible</div>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-6">Tu Plan Nutricional</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <MealCard
          title="Desayuno"
          meal={nutritionPlan.plan_alimenticio.desayuno}
        />
        <MealCard
          title="Snack Mañana"
          meal={nutritionPlan.plan_alimenticio.snack_manana}
        />
        <MealCard
          title="Almuerzo"
          meal={nutritionPlan.plan_alimenticio.almuerzo}
        />
        <MealCard
          title="Snack Tarde"
          meal={nutritionPlan.plan_alimenticio.snack_tarde}
        />
        <MealCard title="Cena" meal={nutritionPlan.plan_alimenticio.cena} />
      </div>

      <div className="mt-6 border rounded-lg p-4 bg-gray-50">
        <h3 className="font-bold mb-2">Recomendaciones Generales</h3>
        <ul className="list-disc pl-5 space-y-1">
          {nutritionPlan.recomendaciones_generales.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

import { Card, CardContent } from "@/components/ui/card";
import { useContext, useEffect } from "react";
import { AuthContext } from "@/AuthContext";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useState } from "react";

function YourProgress() {
  const [graphData, setGraphData] = useState([]);
  const { user } = useContext(AuthContext);

  const chartConfig = {
    weight: {
      label: "weight",
      color: "hsl(var(--chart-1))",
    },
  };

  async function obtainData(idExercise) {
    const response = await fetch(
      `http://localhost:9000/user-progress/${user.id}/${idExercise}`
    );
    if (!response.ok) {
      throw new Error("An error ocurred while fetching");
    }

    const data = await response.json();
    const fetchedData = data.map((item) => ({
      date: item.date.toString(),
      weight: item.weight,
      repetitions: item.repetitions,
    }));
    setGraphData(fetchedData);
  }

  useEffect(() => {
    obtainData(1);
  }, []);

  const handleChange = async (event) => {
    const idExercise = event.target.value;
    obtainData(idExercise);
  };

  // TODO: Actualizar el select para recibir todoslos ejercicios de la BBDD y añadir que puedas poner tus propios PRs

  return (
    <div className="mx-auto my-10 w-120 sm:w-150 md:w-200 lg:w-240 xl:w-240">
      <select
        name=""
        className="bg-gray-50 mb-3 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary focus:border-primary block w-50 p-2"
        onChange={handleChange}
      >
        <option value="1" default>
          Press Banca
        </option>
        <option value="2">Squat</option>
      </select>

      <Card className="">
        <CardContent>
          <ChartContainer config={chartConfig}>
            <LineChart
              accessibilityLayer
              data={graphData}
              margin={{
                left: 12,
                right: 12,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={true}
                axisLine={true}
                tickMargin={8}
                tickFormatter={(value) => ""}
              />
              <YAxis
                domain={["auto", "auto"]}
                tickLine={false}
                axisLine={false}
              />
              <ChartTooltip
                cursor={false}
                trigger="item"
                content={<ChartTooltipContent />}
                isAnimationActive={false}
                filterNull={true}
                activeDot={{ r: 8 }}
              />
              <Line
                dataKey="weight"
                type="natural"
                stroke="gray"
                strokeWidth={1}
                animationDuration={300}
                dot={{
                  stroke: "var(--dot-light-color)",
                  fill: "var(--dot-light-color)",
                  r: 4,
                }}
                activeDot={{
                  stroke: "var(--dot-color)",
                  fill: "var(--dot-color)",
                  strokeWidth: 2,
                  r: 5,
                }}
              />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}

export default YourProgress;

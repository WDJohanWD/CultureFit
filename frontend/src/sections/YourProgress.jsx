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
  const [exerciseList, setExerciseList] = useState([]);
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

  async function getExercises() {
    const response = await fetch(`http://localhost:9000/exercise`);
    if (!response.ok) {
      throw new Error("An error ocurred while fetching");
    }
    const data = await response.json();
    setExerciseList(data);
  }

  useEffect(() => {
    obtainData(1);
    getExercises();
  }, []);

  const handleChange = (event) => {
    const idExercise = event.target.value;
    obtainData(idExercise);
  };

  // TODO: Añadir que puedas poner tus propios PRs

  return (
    <div className="mx-auto my-10 w-120 sm:w-150 md:w-200 lg:w-240 xl:w-240">
      <select
        name=""
        className="bg-gray-50 mb-3 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary focus:border-primary block w-50 p-2"
        onChange={handleChange}
      >
        {exerciseList.map((exercise) => (
          <option key={exercise.id} value={exercise.id}>
            {exercise.name}
          </option>
        ))}
      </select>

      {graphData.length === 0 ? (
        <Card className="w-full h-max">
          <CardContent className="flex items-center justify-center h-60.5 sm:h-77.5 md:h-105.5 lg:h-128">
            <h1 className="text-primary uppercase montserrat font-semibold text-center text-2xl">
              You haven't started your progress in this exercise
            </h1>
          </CardContent>
        </Card>
      ) : (
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
      )}
    </div>
  );
}

export default YourProgress;

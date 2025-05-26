import { useContext, useEffect, useState, Da } from "react";
import { AuthContext } from "@/AuthContext";
import { useTranslation } from "react-i18next";
import { Card, CardContent } from "@/components/ui/card";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

function Public_Progress({ id }) {
  const { t } = useTranslation("progress");

  const [selectedExercise, setSelectedExercise] = useState(1);
  const [graphData, setGraphData] = useState([]);
  const [exerciseList, setExerciseList] = useState([]);

  const chartConfig = {
    weight: {
      label: "weight",
      color: "hsl(var(--chart-1))",
    },
  };

  async function obtainData(idExercise) {
    const response = await fetch(
      `http://localhost:9000/user-progress/${id}/${idExercise}`
    );
    if (!response.ok) {
      throw new Error("An error ocurred while fetching");
    }

    const data = await response.json();
    const fetchedData = data.map((item) => ({
      id: item.id,
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

  useEffect(() => {
    obtainData(selectedExercise);
  }, [selectedExercise]);

  const handleChange = (event) => {
    setSelectedExercise(event.target.value);
  };

  if (exerciseList.length == 0)
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="h-24 w-24 bg-muted rounded-full"></div>
          <div className="h-6 w-48 bg-muted rounded"></div>
          <div className="h-4 w-32 bg-muted rounded"></div>
        </div>
      </div>
    );


  return (
    <div className="flex flex-col xl:flex-row">
      <div className="xl:w-[65%] w-full my-5 mx-auto">
        <select
          name=""
          className="bg-gray-50 mb-3 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary focus:border-primary block w-50 p-2"
          value={selectedExercise}
          onChange={handleChange}
        >
          {exerciseList.map((exercise) => (
            <option key={exercise.id} value={exercise.id}>
              {exercise[t("exerciseName")]}
            </option>
          ))}
        </select>

        {graphData.length === 0 ? (
          <Card className="w-full h-max">
            <CardContent className="flex items-center justify-center h-60.5 sm:h-77.5 md:h-105.5 lg:h-128">
              <h1 className="uppercase montserrat font-semibold text-center text-2xl">
                {t("noPublicData")}
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
                    tickMargin={10}
                    tickFormatter={(value) => ""}
                  />
                  <YAxis
                    domain={[
                      (dataMin) => dataMin * 0.9,
                      (dataMax) => dataMax * 1.05,
                    ]}
                    tickLine={false}
                    axisLine={false}
                    tickCount={5}
                    tickFormatter={(value) => Math.round(value / 10) * 10}
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
    </div>
  );
}

export default Public_Progress;

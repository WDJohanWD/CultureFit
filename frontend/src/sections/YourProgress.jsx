import { useContext, useEffect, useState, Da } from "react";
import { AuthContext } from "@/AuthContext";
import { useTranslation } from "react-i18next";

import { format, set } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Card, CardContent } from "@/components/ui/card";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

function YourProgress() {
  const { t } = useTranslation("progress");
  const { user } = useContext(AuthContext);

  const [selectedExercise, setSelectedExercise] = useState(1);
  const [graphData, setGraphData] = useState([]);
  const [exerciseList, setExerciseList] = useState([]);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [pointToDelete, setPointToDelete] = useState(null);

  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [exercise, setExercise] = useState("");
  const [weight, setWeight] = useState("");
  const [reps, setReps] = useState("");

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

  const handleChange = (event) => {
    setSelectedExercise(event.target.value);
  };

  useEffect(() => {
    obtainData(selectedExercise);
  }, [selectedExercise]);

  async function createProgressPoint() {
    const newPP = {
      id: `${Date.now()}`,
      date: date,
      repetitions: reps,
      weight: weight,
      exerciseId: exercise,
      userId: user.id,
    };
    console.log(newPP);

    const response = await fetch("http://localhost:9000/new-progress-point", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newPP),
    });

    setSelectedExercise(exercise);
    obtainData(selectedExercise);
  }

  const handlePointClick = (e) => {
    if (e.activePayload) {
      const clickedPoint = e.activePayload[0].payload;
      setPointToDelete(clickedPoint);
      setIsDeleteDialogOpen(true);
    }
  };

  const confirmDelete = async () => {
    if (pointToDelete) {
      await deleteProgressPoint(pointToDelete.id);
      setIsDeleteDialogOpen(false);
      setPointToDelete(null);
    }
  };

  async function deleteProgressPoint(id) {
    try {
      const response = await fetch(
        `http://localhost:9000/delete-progress-point/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Error al eliminar el punto");
      }

      obtainData(selectedExercise);
    } catch (error) {
      console.error("Error:", error);
    }
  }

  return (
    <div className="flex flex-col xl:flex-row">
      <div className="w-full xl:w-[60%] my-5">
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
                {t("noData")}
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
                  onClick={handlePointClick}
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
            <AlertDialog
              open={isDeleteDialogOpen}
              onOpenChange={setIsDeleteDialogOpen}
            >
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>{`${t("confirmTitle")}`}</AlertDialogTitle>
                  <AlertDialogDescription>
                    {pointToDelete &&
                      `${t("confirmDesc")} ${pointToDelete.date}`}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>{`${t("confirmN")}`}</AlertDialogCancel>
                  <AlertDialogAction onClick={confirmDelete}>
                    {`${t("confirmY")}`}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </Card>
        )}
      </div>
      <div className="mt-5 xl:mt-15 mx-auto px-4 w-full md:w-120">
        <div className="flex-row md:items-end justify-between gap-4 flex-wrap">
          <div className="flex-1 min-w-[200px]">
            <label
              htmlFor="exercise"
              className="montserrat font-semibold block mb-1"
            >
              {t("exercise")}
            </label>
            <select
              name="exercise"
              className="border border-gray-300 text-gray-500 text-sm rounded-lg hover:bg-gray-100 block w-full p-2"
              value={exercise}
              onChange={(e) => setExercise(e.target.value)}
            >
              <option value="" disabled>
                {t("select")}
              </option>
              {exerciseList.map((exercise) => (
                <option key={exercise.id} value={exercise.id}>
                  {exercise[t("exerciseName")]}
                </option>
              ))}
            </select>
          </div>

          <div className="flex-1 min-w-[100px]">
            <label
              htmlFor="date"
              className="montserrat font-semibold block mb-1"
            >
              {t("date")}
            </label>
            <Popover>
              <PopoverTrigger className="w-full">
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal text-gray-500 border border-gray-300",
                    !date && "text-muted-foreground"
                  )}
                  id="date"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? (
                    format(date, "PPP")
                  ) : (
                    <span></span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 z-50">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                  disabled={(date) => date > new Date()}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex-1 min-w-[150px] relative">
            <label
              htmlFor="weight"
              className="montserrat font-semibold block mb-1"
            >
              {t("weight")}
            </label>
            <div className="flex">
              <input
                type="number"
                id="weight"
                min={1}
                placeholder="0"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="border border-gray-300 text-gray-500 text-sm rounded-lg hover:bg-gray-100 block w-full p-2 pr-10 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
              <span className="absolute right-3 bottom-2 text-gray-400">
                kg
              </span>
            </div>
          </div>

          <div className="flex-1 min-w-[150px]">
            <label
              htmlFor="repetitions"
              className="montserrat font-semibold block mb-1"
            >
              {t("reps")}
            </label>
            <input
              type="number"
              id="repetitions"
              min={1}
              placeholder="0"
              value={reps}
              onChange={(e) => setReps(e.target.value)}
              className="border border-gray-300 text-gray-500 text-sm rounded-lg hover:bg-gray-100 block w-full p-2 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
          </div>

          <Button
            type="submit"
            className="w-full md:w-auto mt-3 md:mt-3 text-white bg-gradient-to-r from-orange-400 to-orange-600 
      hover:shadow-lg hover:shadow-orange-500/50 font-semibold rounded-lg text-lg py-2.5 px-6"
            onClick={createProgressPoint}
          >
            {t("add")}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default YourProgress;

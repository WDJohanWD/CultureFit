import { TrendingUp } from "lucide-react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis} from "recharts";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartData = [
  { date: "23/07/2024", Weight: 40, repetitions: 12 },
  { date: "23/07/2024", Weight: 45, repetitions: 10 },
  { date: "23/07/2024", Weight: 45, repetitions: 12 },
  { date: "23/07/2024", Weight: 50, repetitions: 12 },
  { date: "23/07/2024", Weight: 55, repetitions: 10 },
  { date: "23/07/2024", Weight: 55, repetitions: 12 },
  { date: "23/07/2024", Weight: 55, repetitions: 12 },
  { date: "23/07/2024", Weight: 55, repetitions: 12 },
  { date: "23/07/2024", Weight: 55, repetitions: 12 },
  { date: "23/07/2024", Weight: 55, repetitions: 12 },
  { date: "23/07/2024", Weight: 55, repetitions: 12 },
  { date: "23/07/2024", Weight: 55, repetitions: 12 },
  { date: "23/07/2024", Weight: 55, repetitions: 12 },
];

const chartConfig = {
  Weight: {
    label: "Weight",
    color: "hsl(var(--chart-1))",
  },
};

export function YourProgress() {
  return (
    <Card className="mx-auto my-20 w-120 sm:w-150 md:w-200 lg:w-240 xl:w-240">
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={chartData}
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
              domain={[0, 'auto']}
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
              dataKey="Weight"
              type="linear"
              stroke="gray"
              strokeWidth={1}
              dot={{ stroke: "var(--dot-light-color)", fill: "var(--dot-light-color)", r: 4 }}
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
  );
}

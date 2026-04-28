"use client"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { segmentationData, predictionOverTime } from "@/lib/mock-data"

export function PredictionLineChart() {
  return (
    <ChartContainer config={{ predictions: { label: "Predictions", color: "#4f46e5" } }} className="h-[300px]">
      <LineChart data={predictionOverTime}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Line type="monotone" dataKey="predictions" stroke="#4f46e5" strokeWidth={2} />
      </LineChart>
    </ChartContainer>
  )
}

export function PieChartComponent() {
  return (
    <ChartContainer config={{}} className="h-[300px]">
      <PieChart>
        <ChartTooltip content={<ChartTooltipContent />} />
        <Pie
          data={segmentationData}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={100}
          label
        >
          {segmentationData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.fill} />
          ))}
        </Pie>
      </PieChart>
    </ChartContainer>
  )
}

export function BarChartComponent() {
  return (
    <ChartContainer config={{}} className="h-[300px]">
      <BarChart data={segmentationData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="value" fill="#4f46e5" radius={[8, 8, 0, 0]} />
      </BarChart>
    </ChartContainer>
  )
}

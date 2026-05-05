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
  ReferenceLine,
  ScatterChart,
  Scatter,
  ResponsiveContainer,
  TooltipProps
} from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig
} from "@/components/ui/chart"
import { segmentationData, predictionOverTime, shapData, engagementData, sentimentData, trafficSourceData, timeDataHourly } from "@/lib/mock-data"

// Existing Charts
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
          label={({ name, value }) => `${name}: ${value}%`}
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

// New Charts for Dashboard

const shapChartConfig = {
  importance: { label: "Importance", color: "#4f46e5" },
} satisfies ChartConfig

export function ShapBarChart() {
  return (
    <ChartContainer config={shapChartConfig} className="h-[400px]">
      <BarChart data={[...shapData].reverse()} layout="vertical">
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis type="number" domain={[0, 0.35]} tickFormatter={(v) => `${(v * 100).toFixed(0)}%`} />
        <YAxis dataKey="feature" type="category" width={150} tick={{ fontSize: 12 }} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="importance" fill="#4f46e5" radius={[0, 8, 8, 0]} barSize={20}>
          {shapData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={`hsl(${240 - index * 20}, 70%, ${60 - index * 3}%)`} />
          ))}
        </Bar>
      </BarChart>
    </ChartContainer>
  )
}

const engagementChartConfig = {
  converted: { label: "Converted", color: "#4f46e5" },
  notConverted: { label: "Not Converted", color: "#e2e8f0" },
} satisfies ChartConfig

export function EngagementScatterChart() {
  return (
    <ChartContainer config={engagementChartConfig} className="h-[300px]">
      <ScatterChart>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="engagementScore" name="Engagement Score" domain={[0, 1]} tickFormatter={(v) => `${(v * 100).toFixed(0)}%`} />
        <YAxis dataKey="purchaseProbability" name="Purchase Probability" domain={[0, 1]} tickFormatter={(v) => `${(v * 100).toFixed(0)}%`} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Scatter name="Users" data={engagementData} fill="#4f46e5">
          {engagementData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.converted ? "#4f46e5" : "#e2e8f0"} />
          ))}
        </Scatter>
      </ScatterChart>
    </ChartContainer>
  )
}

const sentimentChartConfig = {
  conversionRate: { label: "Conversion Rate", color: "#4f46e5" },
} satisfies ChartConfig

export function SentimentLineChart() {
  return (
    <ChartContainer config={sentimentChartConfig} className="h-[300px]">
      <LineChart data={sentimentData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="sentimentScore" tickFormatter={(v) => `${(v * 100).toFixed(0)}%`} />
        <YAxis tickFormatter={(v) => `${(v * 100).toFixed(0)}%`} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Line type="monotone" dataKey="conversionRate" stroke="#4f46e5" strokeWidth={2} dot={{ fill: "#4f46e5" }} />
      </LineChart>
    </ChartContainer>
  )
}

const trafficChartConfig = {
  conversionRate: { label: "Conversion Rate", color: "#4f46e5" },
  revenue: { label: "Revenue", color: "#818cf8" },
} satisfies ChartConfig

export function TrafficSourceBarChart() {
  return (
    <ChartContainer config={trafficChartConfig} className="h-[300px]">
      <BarChart data={trafficSourceData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="source" />
        <YAxis tickFormatter={(v) => `${(v * 100).toFixed(0)}%`} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar dataKey="conversionRate" fill="#4f46e5" radius={[8, 8, 0, 0]} />
      </BarChart>
    </ChartContainer>
  )
}

const timeChartConfig = {
  conversionRate: { label: "Conversion Rate", color: "#4f46e5" },
} satisfies ChartConfig

export function TimeAnalysisLineChart() {
  return (
    <ChartContainer config={timeChartConfig} className="h-[300px]">
      <LineChart data={timeDataHourly}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="hour" tickFormatter={(v) => `${v}:00`} />
        <YAxis tickFormatter={(v) => `${(v * 100).toFixed(0)}%`} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ReferenceLine y={0.35} stroke="#ef4444" strokeDasharray="3 3" label="Avg" />
        <Line type="monotone" dataKey="conversionRate" stroke="#4f46e5" strokeWidth={2} dot={{ fill: "#4f46e5" }} />
      </LineChart>
    </ChartContainer>
  )
}

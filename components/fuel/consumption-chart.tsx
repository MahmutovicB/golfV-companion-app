"use client"

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"

type DataPoint = {
  date: string
  consumption: number
  mileage: number
}

export function ConsumptionChart({ data }: { data: DataPoint[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Consumption (L/100km)</CardTitle>
        {data.length > 0 && (
          <span className="text-xs text-zinc-500">{data.length} data points</span>
        )}
      </CardHeader>

      {data.length < 2 ? (
        <div className="flex h-48 items-center justify-center">
          <p className="text-sm text-zinc-500">
            Need at least 2 full-tank fill-ups to plot consumption.
          </p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={data} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 11, fill: "#71717a" }}
              tickLine={false}
              axisLine={false}
              interval="preserveStartEnd"
            />
            <YAxis
              tick={{ fontSize: 11, fill: "#71717a" }}
              tickLine={false}
              axisLine={false}
              domain={["auto", "auto"]}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#18181b",
                border: "1px solid #3f3f46",
                borderRadius: "8px",
                fontSize: "12px",
              }}
              labelStyle={{ color: "#a1a1aa" }}
              itemStyle={{ color: "#60a5fa" }}
              formatter={(value) => [`${value} L/100km`, "Consumption"]}
            />
            <Line
              type="monotone"
              dataKey="consumption"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={{ fill: "#3b82f6", r: 3 }}
              activeDot={{ r: 5, fill: "#60a5fa" }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </Card>
  )
}

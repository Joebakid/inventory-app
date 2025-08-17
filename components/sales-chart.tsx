"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts"
import { useState } from "react"
import { Button } from "@/components/ui/button"

interface ChartData {
  date: string
  revenue: number
  quantity: number
  orders: number
}

interface SalesChartProps {
  data: ChartData[]
}

export default function SalesChart({ data }: SalesChartProps) {
  const [chartType, setChartType] = useState<"revenue" | "quantity" | "orders">("revenue")

  if (!data || data.length === 0) {
    return (
      <div className="h-[300px] flex items-center justify-center text-muted-foreground">
        No data available for chart
      </div>
    )
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric" })
  }

  const getYAxisLabel = () => {
    switch (chartType) {
      case "revenue":
        return "Revenue ($)"
      case "quantity":
        return "Items Sold"
      case "orders":
        return "Number of Orders"
    }
  }

  const getDataKey = () => chartType

  const formatTooltipValue = (value: number) => {
    if (chartType === "revenue") {
      return `$${value.toFixed(2)}`
    }
    return value.toString()
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Button
          variant={chartType === "revenue" ? "default" : "outline"}
          size="sm"
          onClick={() => setChartType("revenue")}
        >
          Revenue
        </Button>
        <Button
          variant={chartType === "quantity" ? "default" : "outline"}
          size="sm"
          onClick={() => setChartType("quantity")}
        >
          Quantity
        </Button>
        <Button
          variant={chartType === "orders" ? "default" : "outline"}
          size="sm"
          onClick={() => setChartType("orders")}
        >
          Orders
        </Button>
      </div>

      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === "revenue" ? (
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tickFormatter={formatDate} fontSize={12} />
              <YAxis fontSize={12} tickFormatter={(value) => `$${value}`} />
              <Tooltip
                labelFormatter={(label) => formatDate(label)}
                formatter={(value: number) => [formatTooltipValue(value), getYAxisLabel()]}
              />
              <Line
                type="monotone"
                dataKey={getDataKey()}
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          ) : (
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tickFormatter={formatDate} fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip
                labelFormatter={(label) => formatDate(label)}
                formatter={(value: number) => [formatTooltipValue(value), getYAxisLabel()]}
              />
              <Bar dataKey={getDataKey()} fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  )
}

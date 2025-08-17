"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"

interface StatsData {
  totalProducts: number
  totalUsers: number
  totalRevenue: number
  recentSalesCount: number
}

interface AdminStatsProps {
  data: StatsData
}

export default function AdminStats({ data }: AdminStatsProps) {
  // Mock trend data - in a real app, you'd calculate this from historical data
  const trends = {
    products: { value: 12, isPositive: true },
    users: { value: 8, isPositive: true },
    revenue: { value: 15, isPositive: true },
    sales: { value: -5, isPositive: false },
  }

  const TrendIcon = ({ trend }: { trend: { value: number; isPositive: boolean } }) => {
    if (trend.value === 0) return <Minus className="h-4 w-4 text-muted-foreground" />
    return trend.isPositive ? (
      <TrendingUp className="h-4 w-4 text-green-500" />
    ) : (
      <TrendingDown className="h-4 w-4 text-red-500" />
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Products</CardTitle>
          <TrendIcon trend={trends.products} />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.totalProducts}</div>
          <p className="text-xs text-muted-foreground">
            {trends.products.isPositive ? "+" : ""}
            {trends.products.value}% from last month
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          <TrendIcon trend={trends.users} />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.totalUsers}</div>
          <p className="text-xs text-muted-foreground">
            {trends.users.isPositive ? "+" : ""}
            {trends.users.value}% from last month
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          <TrendIcon trend={trends.revenue} />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${data.totalRevenue.toFixed(2)}</div>
          <p className="text-xs text-muted-foreground">
            {trends.revenue.isPositive ? "+" : ""}
            {trends.revenue.value}% from last month
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Recent Sales</CardTitle>
          <TrendIcon trend={trends.sales} />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.recentSalesCount}</div>
          <p className="text-xs text-muted-foreground">
            {trends.sales.isPositive ? "+" : ""}
            {trends.sales.value}% from last week
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

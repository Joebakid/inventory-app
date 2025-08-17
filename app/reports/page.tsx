import { createClient, isSupabaseConfigured } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Download, Calendar, TrendingUp } from "lucide-react"
import Link from "next/link"
import SalesChart from "@/components/sales-chart"
import ReportsFilters from "@/components/reports-filters"

export default async function ReportsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  if (!isSupabaseConfigured) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <h1 className="text-2xl font-bold mb-4 text-foreground">Connect Supabase to get started</h1>
      </div>
    )
  }

  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Get user profile to check role
  const { data: profile } = await supabase.from("users").select("*").eq("id", user.id).single()

  if (!profile) {
    redirect("/")
  }

  const isAdmin = profile.role === "admin"

  // Parse search params for filtering
  const dateFrom = searchParams.from as string
  const dateTo = searchParams.to as string
  const category = searchParams.category as string

  // Build query with filters
  let salesQuery = supabase
    .from("sales")
    .select(`
      *,
      product:products(*),
      worker:users(*)
    `)
    .order("sale_date", { ascending: false })

  if (!isAdmin) {
    salesQuery = salesQuery.eq("worker_id", user.id)
  }

  if (dateFrom) {
    salesQuery = salesQuery.gte("sale_date", dateFrom)
  }

  if (dateTo) {
    salesQuery = salesQuery.lte("sale_date", dateTo)
  }

  if (category) {
    salesQuery = salesQuery.eq("product.category", category)
  }

  const { data: sales } = await salesQuery

  // Calculate analytics
  const totalRevenue = sales?.reduce((sum, sale) => sum + sale.total_amount, 0) || 0
  const totalQuantity = sales?.reduce((sum, sale) => sum + sale.quantity, 0) || 0
  const averageOrderValue = sales?.length ? totalRevenue / sales.length : 0

  // Group sales by date for chart
  const salesByDate = sales?.reduce(
    (acc, sale) => {
      const date = new Date(sale.sale_date).toISOString().split("T")[0]
      if (!acc[date]) {
        acc[date] = { date, revenue: 0, quantity: 0, orders: 0 }
      }
      acc[date].revenue += sale.total_amount
      acc[date].quantity += sale.quantity
      acc[date].orders += 1
      return acc
    },
    {} as Record<string, { date: string; revenue: number; quantity: number; orders: number }>,
  )

  const chartData = Object.values(salesByDate || {}).sort((a, b) => a.date.localeCompare(b.date))

  // Top products
  const productSales = sales?.reduce(
    (acc, sale) => {
      const productId = sale.product?.id
      if (!productId) return acc

      if (!acc[productId]) {
        acc[productId] = {
          product: sale.product,
          totalRevenue: 0,
          totalQuantity: 0,
          orderCount: 0,
        }
      }
      acc[productId].totalRevenue += sale.total_amount
      acc[productId].totalQuantity += sale.quantity
      acc[productId].orderCount += 1
      return acc
    },
    {} as Record<string, any>,
  )

  const topProducts = Object.values(productSales || {})
    .sort((a: any, b: any) => b.totalRevenue - a.totalRevenue)
    .slice(0, 5)

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold">Sales Reports</h1>
                <p className="text-muted-foreground">Analyze your sales performance</p>
              </div>
            </div>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export Data
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Filters */}
        <ReportsFilters />

        {/* Key Metrics */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">{sales?.length || 0} total sales</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Items Sold</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalQuantity}</div>
              <p className="text-xs text-muted-foreground">Across all products</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Order</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${averageOrderValue.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">Per transaction</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Top Product</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold">{topProducts[0]?.product?.name || "N/A"}</div>
              <p className="text-xs text-muted-foreground">
                ${topProducts[0]?.totalRevenue?.toFixed(2) || "0.00"} revenue
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Sales Chart */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Sales Trend</CardTitle>
            <CardDescription>Daily sales performance over time</CardDescription>
          </CardHeader>
          <CardContent>
            <SalesChart data={chartData} />
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card>
          <CardHeader>
            <CardTitle>Top Performing Products</CardTitle>
            <CardDescription>Products ranked by total revenue</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topProducts.map((item: any, index: number) => (
                <div key={item.product.id} className="flex justify-between items-center p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium">{item.product.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {item.product.category} • {item.orderCount} orders
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">${item.totalRevenue.toFixed(2)}</p>
                    <p className="text-sm text-muted-foreground">{item.totalQuantity} units sold</p>
                  </div>
                </div>
              ))}
              {topProducts.length === 0 && (
                <p className="text-center text-muted-foreground py-8">
                  No sales data available for the selected period
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

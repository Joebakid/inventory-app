"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Sale } from "@/lib/types"
import { formatDistanceToNow } from "date-fns"

interface SalesListProps {
  sales: Sale[]
  isAdmin: boolean
}

export default function SalesList({ sales, isAdmin }: SalesListProps) {
  if (sales.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <p className="text-muted-foreground text-lg mb-2">No sales records found</p>
          <p className="text-sm text-muted-foreground">Start by recording your first sale!</p>
        </CardContent>
      </Card>
    )
  }

  const totalSales = sales.reduce((sum, sale) => sum + sale.total_amount, 0)
  const totalQuantity = sales.reduce((sum, sale) => sum + sale.quantity, 0)

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Sales</CardDescription>
            <CardTitle className="text-2xl">${totalSales.toFixed(2)}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Items Sold</CardDescription>
            <CardTitle className="text-2xl">{totalQuantity}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Records</CardDescription>
            <CardTitle className="text-2xl">{sales.length}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Sales List */}
      <div className="space-y-4">
        {sales.map((sale) => (
          <Card key={sale.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{sale.product?.name}</CardTitle>
                  <CardDescription>
                    {sale.product?.category && (
                      <Badge variant="secondary" className="mr-2">
                        {sale.product.category}
                      </Badge>
                    )}
                    {sale.product?.sku && `SKU: ${sale.product.sku}`}
                  </CardDescription>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold">${sale.total_amount.toFixed(2)}</p>
                  <p className="text-sm text-muted-foreground">
                    {sale.quantity} × ${sale.unit_price.toFixed(2)}
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center text-sm text-muted-foreground">
                <div>
                  {isAdmin && sale.worker && <span>Sold by: {sale.worker.full_name || sale.worker.email}</span>}
                </div>
                <div>{formatDistanceToNow(new Date(sale.sale_date), { addSuffix: true })}</div>
              </div>
              {sale.notes && (
                <div className="mt-3 p-3 bg-muted/50 rounded text-sm">
                  <strong>Notes:</strong> {sale.notes}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

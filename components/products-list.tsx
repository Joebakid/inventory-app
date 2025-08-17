"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Product } from "@/lib/types"
import { Edit, Trash2 } from "lucide-react"

interface ProductsListProps {
  products: Product[]
}

export default function ProductsList({ products }: ProductsListProps) {
  if (products.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <p className="text-muted-foreground text-lg mb-2">No products found</p>
          <p className="text-sm text-muted-foreground">Start by adding your first product!</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Product Overview</CardTitle>
          <CardDescription>
            Total products: {products.length} | Average price: $
            {(products.reduce((sum, p) => sum + p.price, 0) / products.length).toFixed(2)}
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Products Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <Card key={product.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{product.name}</CardTitle>
                  <CardDescription className="mt-1">
                    {product.category && (
                      <Badge variant="secondary" className="mr-2">
                        {product.category}
                      </Badge>
                    )}
                    {product.sku && `SKU: ${product.sku}`}
                  </CardDescription>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold">${product.price.toFixed(2)}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {product.description && <p className="text-sm text-muted-foreground mb-4">{product.description}</p>}

              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button variant="outline" size="sm" className="text-destructive hover:text-destructive bg-transparent">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

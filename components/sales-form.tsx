"use client"

import { useActionState } from "react"
import { useFormStatus } from "react-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { createSale } from "@/lib/actions"
import type { Product } from "@/lib/types"

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Recording sale...
        </>
      ) : (
        "Record Sale"
      )}
    </Button>
  )
}

interface SalesFormProps {
  products: Product[]
  userId: string
}

export default function SalesForm({ products, userId }: SalesFormProps) {
  const router = useRouter()
  const [state, formAction] = useActionState(createSale, null)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [quantity, setQuantity] = useState(1)

  // Handle successful sale creation
  useEffect(() => {
    if (state?.success) {
      router.push("/sales")
    }
  }, [state, router])

  // Calculate total when product or quantity changes
  const total = selectedProduct ? selectedProduct.price * quantity : 0

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <Link href="/sales">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Sales
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Record New Sale</CardTitle>
          <CardDescription>Enter the details of the product sale</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-6">
            <input type="hidden" name="userId" value={userId} />

            {state?.error && (
              <div className="bg-destructive/10 border border-destructive/50 text-destructive px-4 py-3 rounded">
                {state.error}
              </div>
            )}

            <div className="space-y-2">
              <label htmlFor="productId" className="block text-sm font-medium">
                Product
              </label>
              <Select
                name="productId"
                onValueChange={(value) => {
                  const product = products.find((p) => p.id === value)
                  setSelectedProduct(product || null)
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a product" />
                </SelectTrigger>
                <SelectContent>
                  {products.map((product) => (
                    <SelectItem key={product.id} value={product.id}>
                      {product.name} - ${product.price.toFixed(2)}
                      {product.category && ` (${product.category})`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedProduct && (
              <div className="bg-muted/50 p-4 rounded-lg">
                <h4 className="font-medium">{selectedProduct.name}</h4>
                <p className="text-sm text-muted-foreground">{selectedProduct.description}</p>
                <p className="text-sm font-medium mt-2">Unit Price: ${selectedProduct.price.toFixed(2)}</p>
              </div>
            )}

            <div className="space-y-2">
              <label htmlFor="quantity" className="block text-sm font-medium">
                Quantity
              </label>
              <Input
                id="quantity"
                name="quantity"
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Number.parseInt(e.target.value) || 1)}
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="unitPrice" className="block text-sm font-medium">
                Unit Price
              </label>
              <Input
                id="unitPrice"
                name="unitPrice"
                type="number"
                step="0.01"
                min="0"
                value={selectedProduct?.price || ""}
                placeholder="0.00"
                required
              />
              <p className="text-xs text-muted-foreground">
                This will auto-fill when you select a product, but you can adjust if needed
              </p>
            </div>

            {total > 0 && (
              <div className="bg-primary/10 p-4 rounded-lg">
                <p className="text-lg font-semibold">Total: ${total.toFixed(2)}</p>
              </div>
            )}

            <div className="space-y-2">
              <label htmlFor="notes" className="block text-sm font-medium">
                Notes (Optional)
              </label>
              <Textarea id="notes" name="notes" placeholder="Any additional notes about this sale..." rows={3} />
            </div>

            <SubmitButton />
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

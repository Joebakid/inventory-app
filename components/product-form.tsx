"use client"

import { useActionState } from "react"
import { useFormStatus } from "react-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { createProduct } from "@/lib/actions"

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Creating product...
        </>
      ) : (
        "Create Product"
      )}
    </Button>
  )
}

interface ProductFormProps {
  userId: string
}

export default function ProductForm({ userId }: ProductFormProps) {
  const router = useRouter()
  const [state, formAction] = useActionState(createProduct, null)

  // Handle successful product creation
  useEffect(() => {
    if (state?.success) {
      router.push("/admin/products")
    }
  }, [state, router])

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <Link href="/admin/products">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Products
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Add New Product</CardTitle>
          <CardDescription>Enter the details for the new product</CardDescription>
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
              <label htmlFor="name" className="block text-sm font-medium">
                Product Name *
              </label>
              <Input id="name" name="name" type="text" placeholder="Enter product name" required />
            </div>

            <div className="space-y-2">
              <label htmlFor="description" className="block text-sm font-medium">
                Description
              </label>
              <Textarea id="description" name="description" placeholder="Enter product description..." rows={3} />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="price" className="block text-sm font-medium">
                  Price *
                </label>
                <Input id="price" name="price" type="number" step="0.01" min="0" placeholder="0.00" required />
              </div>

              <div className="space-y-2">
                <label htmlFor="category" className="block text-sm font-medium">
                  Category
                </label>
                <Input id="category" name="category" type="text" placeholder="e.g., Electronics" />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="sku" className="block text-sm font-medium">
                SKU (Stock Keeping Unit)
              </label>
              <Input id="sku" name="sku" type="text" placeholder="e.g., LAP-001" />
              <p className="text-xs text-muted-foreground">Optional unique identifier for inventory tracking</p>
            </div>

            <SubmitButton />
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

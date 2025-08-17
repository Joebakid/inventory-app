"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Filter, X } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"

export default function ReportsFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [dateFrom, setDateFrom] = useState(searchParams.get("from") || "")
  const [dateTo, setDateTo] = useState(searchParams.get("to") || "")
  const [category, setCategory] = useState(searchParams.get("category") || "All categories")

  const applyFilters = () => {
    const params = new URLSearchParams()

    if (dateFrom) params.set("from", dateFrom)
    if (dateTo) params.set("to", dateTo)
    if (category !== "All categories") params.set("category", category)

    router.push(`/reports?${params.toString()}`)
  }

  const clearFilters = () => {
    setDateFrom("")
    setDateTo("")
    setCategory("All categories")
    router.push("/reports")
  }

  const hasActiveFilters = dateFrom || dateTo || category !== "All categories"

  return (
    <Card className="mb-8">
      <CardContent className="pt-6">
        <div className="flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium mb-2">Date From</label>
            <Input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
          </div>

          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium mb-2">Date To</label>
            <Input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
          </div>

          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium mb-2">Category</label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="All categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All categories">All categories</SelectItem>
                <SelectItem value="Electronics">Electronics</SelectItem>
                <SelectItem value="Furniture">Furniture</SelectItem>
                <SelectItem value="Stationery">Stationery</SelectItem>
                <SelectItem value="Kitchen">Kitchen</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2">
            <Button onClick={applyFilters}>
              <Filter className="h-4 w-4 mr-2" />
              Apply Filters
            </Button>

            {hasActiveFilters && (
              <Button variant="outline" onClick={clearFilters}>
                <X className="h-4 w-4 mr-2" />
                Clear
              </Button>
            )}
          </div>
        </div>

        {hasActiveFilters && (
          <div className="mt-4 flex flex-wrap gap-2">
            {dateFrom && (
              <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                From: {new Date(dateFrom).toLocaleDateString()}
              </div>
            )}
            {dateTo && (
              <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                To: {new Date(dateTo).toLocaleDateString()}
              </div>
            )}
            {category !== "All categories" && (
              <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">Category: {category}</div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

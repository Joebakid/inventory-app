import { createClient, isSupabaseConfigured } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import SalesList from "@/components/sales-list"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Plus } from "lucide-react"

export default async function SalesPage() {
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

  // Get sales records - admins see all, workers see only their own
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

  const { data: sales } = await salesQuery

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Sales Records</h1>
          <Link href="/sales/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Record Sale
            </Button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <SalesList sales={sales || []} isAdmin={isAdmin} />
      </main>
    </div>
  )
}

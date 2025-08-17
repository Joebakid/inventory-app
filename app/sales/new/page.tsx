import { createClient, isSupabaseConfigured } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import SalesForm from "@/components/sales-form"

export default async function NewSalePage() {
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

  if (!profile || !["worker", "admin"].includes(profile.role)) {
    redirect("/")
  }

  // Get all products for the dropdown
  const { data: products } = await supabase.from("products").select("*").order("name")

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold">Record New Sale</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <SalesForm products={products || []} userId={user.id} />
      </main>
    </div>
  )
}

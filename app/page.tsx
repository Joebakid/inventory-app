import { createClient, isSupabaseConfigured } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LogOut, Package, Users, BarChart3, TrendingUp } from "lucide-react"
import { signOut } from "@/lib/actions"
import Link from "next/link"

export default async function Home() {
  // If Supabase is not configured, show setup message directly
  if (!isSupabaseConfigured) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <h1 className="text-2xl font-bold mb-4 text-foreground">Connect Supabase to get started</h1>
      </div>
    )
  }

  // Get the user from the server
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // If no user, redirect to login
  if (!user) {
    redirect("/auth/login")
  }

  // Get user profile to check role
  const { data: profile } = await supabase.from("users").select("*").eq("id", user.id).single()

  const isAdmin = profile?.role === "admin"

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Package className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold">Inventory Manager</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">Welcome, {profile?.full_name || user.email}</span>
            <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
              {profile?.role || "worker"}
            </span>
            <form action={signOut}>
              <Button type="submit" variant="outline" size="sm">
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </form>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Record Sales
              </CardTitle>
              <CardDescription>Add new product sales to the system</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/sales/new">
                <Button className="w-full">Record New Sale</Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                View Sales
              </CardTitle>
              <CardDescription>{isAdmin ? "View all sales records" : "View your sales records"}</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/sales">
                <Button variant="outline" className="w-full bg-transparent">
                  View Sales
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Sales Reports
              </CardTitle>
              <CardDescription>Analyze sales performance and trends</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/reports">
                <Button variant="secondary" className="w-full">
                  View Reports
                </Button>
              </Link>
            </CardContent>
          </Card>

          {isAdmin && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Admin Dashboard
                </CardTitle>
                <CardDescription>Manage products and view reports</CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/admin">
                  <Button variant="secondary" className="w-full">
                    Open Dashboard
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}

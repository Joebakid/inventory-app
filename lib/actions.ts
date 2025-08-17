"use server"

import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

// Sign in action
export async function signIn(prevState: any, formData: FormData) {
  if (!formData) {
    return { error: "Form data is missing" }
  }

  const email = formData.get("email")
  const password = formData.get("password")

  if (!email || !password) {
    return { error: "Email and password are required" }
  }

  const cookieStore = cookies()
  const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value
      },
      set(name: string, value: string, options: any) {
        cookieStore.set({ name, value, ...options })
      },
      remove(name: string, options: any) {
        cookieStore.set({ name, value: "", ...options })
      },
    },
  })

  try {
    const { error } = await supabase.auth.signInWithPassword({
      email: email.toString(),
      password: password.toString(),
    })

    if (error) {
      return { error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.error("Login error:", error)
    return { error: "An unexpected error occurred. Please try again." }
  }
}

// Sign up action
export async function signUp(prevState: any, formData: FormData) {
  if (!formData) {
    return { error: "Form data is missing" }
  }

  const email = formData.get("email")
  const password = formData.get("password")
  const fullName = formData.get("fullName")
  const role = formData.get("role") || "worker"

  if (!email || !password) {
    return { error: "Email and password are required" }
  }

  const cookieStore = cookies()
  const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value
      },
      set(name: string, value: string, options: any) {
        cookieStore.set({ name, value, ...options })
      },
      remove(name: string, options: any) {
        cookieStore.set({ name, value: "", ...options })
      },
    },
  })

  try {
    const { data, error } = await supabase.auth.signUp({
      email: email.toString(),
      password: password.toString(),
      options: {
        emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || "http://localhost:3000",
        data: {
          full_name: fullName?.toString(),
          role: role.toString(),
        },
      },
    })

    if (error) {
      return { error: error.message }
    }

    if (data.user && !data.user.email_confirmed_at) {
      // For email confirmation flow, we'll create the profile after confirmation
      return { success: "Check your email to confirm your account." }
    } else if (data.user) {
      // Try to create profile, but don't fail if tables don't exist yet
      try {
        const { error: profileError } = await supabase.from("users").insert({
          id: data.user.id,
          email: data.user.email!,
          full_name: fullName?.toString(),
          role: role.toString(),
        })

        if (profileError) {
          console.log("[v0] Profile creation will be handled after database setup:", profileError.message)
        }
      } catch (profileError) {
        console.log("[v0] Profile creation will be handled after database setup")
      }
    }

    return { success: "Account created successfully!" }
  } catch (error) {
    console.error("Sign up error:", error)
    return { error: "An unexpected error occurred. Please try again." }
  }
}

// Sign out action
export async function signOut() {
  const cookieStore = cookies()
  const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value
      },
      set(name: string, value: string, options: any) {
        cookieStore.set({ name, value, ...options })
      },
      remove(name: string, options: any) {
        cookieStore.set({ name, value: "", ...options })
      },
    },
  })

  await supabase.auth.signOut()
  redirect("/auth/login")
}

export async function createSale(prevState: any, formData: FormData) {
  if (!formData) {
    return { error: "Form data is missing" }
  }

  const productId = formData.get("productId")
  const userId = formData.get("userId")
  const quantity = formData.get("quantity")
  const unitPrice = formData.get("unitPrice")
  const notes = formData.get("notes")

  // Validate required fields
  if (!productId || !userId || !quantity || !unitPrice) {
    return { error: "All required fields must be filled" }
  }

  const cookieStore = cookies()
  const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value
      },
      set(name: string, value: string, options: any) {
        cookieStore.set({ name, value, ...options })
      },
      remove(name: string, options: any) {
        cookieStore.set({ name, value: "", ...options })
      },
    },
  })

  try {
    // Verify the user exists and has permission
    const { data: user } = await supabase.from("users").select("*").eq("id", userId.toString()).single()

    if (!user || !["worker", "admin"].includes(user.role)) {
      return { error: "Unauthorized to create sales records" }
    }

    // Create the sale record
    const { error } = await supabase.from("sales").insert({
      product_id: productId.toString(),
      worker_id: userId.toString(),
      quantity: Number.parseInt(quantity.toString()),
      unit_price: Number.parseFloat(unitPrice.toString()),
      notes: notes?.toString() || null,
    })

    if (error) {
      console.error("Sale creation error:", error)
      return { error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.error("Sale creation error:", error)
    return { error: "An unexpected error occurred. Please try again." }
  }
}

export async function createProduct(prevState: any, formData: FormData) {
  if (!formData) {
    return { error: "Form data is missing" }
  }

  const name = formData.get("name")
  const description = formData.get("description")
  const price = formData.get("price")
  const category = formData.get("category")
  const sku = formData.get("sku")
  const userId = formData.get("userId")

  // Validate required fields
  if (!name || !price || !userId) {
    return { error: "Name, price, and user ID are required" }
  }

  const cookieStore = cookies()
  const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value
      },
      set(name: string, value: string, options: any) {
        cookieStore.set({ name, value, ...options })
      },
      remove(name: string, options: any) {
        cookieStore.set({ name, value: "", ...options })
      },
    },
  })

  try {
    // Verify the user is an admin
    const { data: user } = await supabase.from("users").select("*").eq("id", userId.toString()).single()

    if (!user || user.role !== "admin") {
      return { error: "Unauthorized to create products" }
    }

    // Create the product
    const { error } = await supabase.from("products").insert({
      name: name.toString(),
      description: description?.toString() || null,
      price: Number.parseFloat(price.toString()),
      category: category?.toString() || null,
      sku: sku?.toString() || null,
      created_by: userId.toString(),
    })

    if (error) {
      console.error("Product creation error:", error)
      return { error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.error("Product creation error:", error)
    return { error: "An unexpected error occurred. Please try again." }
  }
}

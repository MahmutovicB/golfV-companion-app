import { createClient } from "@supabase/supabase-js"
import dotenv from "dotenv"

dotenv.config({ path: ".env.local" })

const email = process.argv[2]
const password = process.argv[3]

if (!email || !password) {
  console.error("Usage: node scripts/create-user.mjs <email> <password>")
  process.exit(1)
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
)

// Delete existing user with this email if any, then create fresh
const { data: existing } = await supabase.auth.admin.listUsers()
const existingUser = existing?.users?.find(u => u.email === email)

if (existingUser) {
  await supabase.auth.admin.deleteUser(existingUser.id)
  console.log("Removed existing user.")
}

const { data, error } = await supabase.auth.admin.createUser({
  email,
  password,
  email_confirm: true,
})

if (error) {
  console.error("Failed:", error.message)
  process.exit(1)
}

console.log(`✓ User created and confirmed: ${data.user.email} (${data.user.id})`)

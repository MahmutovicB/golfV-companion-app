import Link from "next/link"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { LogoutButton } from "@/components/ui/logout-button"
import { prisma } from "@/lib/prisma"

const NAV_ITEMS = [
  { href: "/", label: "Dashboard", icon: "⬡" },
  { href: "/maintenance", label: "Maintenance", icon: "🔧" },
  { href: "/fault-codes", label: "Fault Codes", icon: "⚠" },
  { href: "/fuel", label: "Fuel", icon: "⛽" },
  { href: "/documents", label: "Documents", icon: "📄" },
  { href: "/obd2", label: "OBD2 Live", icon: "📡" },
  { href: "/repairs", label: "Repairs", icon: "📋" },
]

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect("/login")

  // Auto-create the Prisma User record on first login using the Supabase auth UUID.
  // If the email exists with a stale id (e.g. after auth user was recreated), clean it up first.
  try {
    await prisma.user.upsert({
      where: { id: user.id },
      update: {},
      create: { id: user.id, email: user.email! },
    })
  } catch {
    await prisma.user.deleteMany({ where: { email: user.email! } })
    await prisma.user.create({ data: { id: user.id, email: user.email! } })
  }

  return (
    <div className="flex min-h-screen flex-col">
      {/* Top nav on mobile, sidebar on desktop */}
      <header className="sticky top-0 z-50 border-b border-zinc-800 bg-zinc-950/95 backdrop-blur lg:hidden">
        <div className="flex h-14 items-center justify-between px-4">
          <span className="font-bold text-zinc-100">Golf BKC</span>
          <LogoutButton />
        </div>
        <nav className="flex overflow-x-auto scrollbar-hide pb-2 px-4 gap-2">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100 transition-colors"
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
      </header>

      <div className="flex flex-1">
        {/* Sidebar — desktop only */}
        <aside className="hidden lg:flex lg:w-60 lg:flex-col lg:border-r lg:border-zinc-800 lg:bg-zinc-950">
          <div className="flex h-14 items-center px-5 border-b border-zinc-800">
            <span className="font-bold text-zinc-100">Golf BKC Companion</span>
          </div>
          <nav className="flex-1 space-y-1 p-3">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100 transition-colors"
              >
                <span className="text-base">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
          <div className="border-t border-zinc-800 p-3">
            <div className="mb-2 px-3 text-xs text-zinc-500 truncate">{user.email}</div>
            <LogoutButton />
          </div>
        </aside>

        <main className="flex-1 overflow-auto">
          <div className="mx-auto max-w-5xl px-4 py-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import {
  Book,
  Calendar,
  LayoutDashboard,
  LogOut,
  Settings,
  Star,
  PenLine,
} from 'lucide-react'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <aside className="w-64 border-r border-black/5 dark:border-white/5 bg-white/50 dark:bg-black/20 backdrop-blur-xl hidden md:flex flex-col">
        <div className="p-6">
          <h1 className="text-xl font-light tracking-tight text-foreground flex items-center gap-2">
            <Book className="w-5 h-5 text-pink-400" />
            Dear Diary
          </h1>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg text-foreground hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
          >
            <LayoutDashboard className="w-4 h-4 opacity-70" />
            Overview
          </Link>
          <Link
            href="/dashboard/entries"
            className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg text-foreground hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
          >
            <PenLine className="w-4 h-4 opacity-70" />
            Journal
          </Link>
          <Link
            href="/dashboard/calendar"
            className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg text-foreground hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
          >
            <Calendar className="w-4 h-4 opacity-70" />
            Calendar
          </Link>
          <Link
            href="/dashboard/favorites"
            className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg text-foreground hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
          >
            <Star className="w-4 h-4 opacity-70" />
            Favorites
          </Link>
          <Link
            href="/dashboard/settings"
            className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg text-foreground hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
          >
            <Settings className="w-4 h-4 opacity-70" />
            Settings
          </Link>
        </nav>

        <div className="p-4 border-t border-black/5 dark:border-white/5">
          <form action="/auth/signout" method="post">
            <button
              type="submit"
              className="flex w-full items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Sign out
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 relative overflow-y-auto overflow-x-hidden">
        {children}
      </main>
    </div>
  )
}

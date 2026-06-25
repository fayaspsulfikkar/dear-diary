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
      <aside className="w-64 glass border-r-0 md:border-r border-black/5 dark:border-white/5 hidden md:flex flex-col z-10">
        <div className="p-8">
          <h1 className="text-xl font-light tracking-tight text-foreground flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-blush flex items-center justify-center shadow-[inset_0_1px_0_rgba(255,255,255,0.4)] dark:shadow-none ring-1 ring-black/5 dark:ring-white/10">
              <Book className="w-4 h-4 text-blush-foreground" />
            </div>
            Dear Diary
          </h1>
        </div>

        <nav className="flex-1 px-4 space-y-1.5 mt-2">
          <Link
            href="/dashboard"
            className="group flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-xl text-muted-foreground hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5 transition-all duration-300"
          >
            <LayoutDashboard className="w-4 h-4 opacity-60 group-hover:opacity-100 group-hover:text-primary transition-colors" />
            Overview
          </Link>
          <Link
            href="/dashboard/entries"
            className="group flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-xl text-muted-foreground hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5 transition-all duration-300"
          >
            <PenLine className="w-4 h-4 opacity-60 group-hover:opacity-100 group-hover:text-primary transition-colors" />
            Journal
          </Link>
          <Link
            href="/dashboard/calendar"
            className="group flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-xl text-muted-foreground hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5 transition-all duration-300"
          >
            <Calendar className="w-4 h-4 opacity-60 group-hover:opacity-100 group-hover:text-primary transition-colors" />
            Calendar
          </Link>
          <Link
            href="/dashboard/favorites"
            className="group flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-xl text-muted-foreground hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5 transition-all duration-300"
          >
            <Star className="w-4 h-4 opacity-60 group-hover:opacity-100 group-hover:text-primary transition-colors" />
            Favorites
          </Link>
          <Link
            href="/dashboard/settings"
            className="group flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-xl text-muted-foreground hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5 transition-all duration-300"
          >
            <Settings className="w-4 h-4 opacity-60 group-hover:opacity-100 group-hover:text-primary transition-colors" />
            Settings
          </Link>
        </nav>

        <div className="p-4 border-t border-black/5 dark:border-white/5">
          <form action="/auth/signout" method="post">
            <button
              type="submit"
              className="group flex w-full items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-xl text-red-500/80 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all duration-300"
            >
              <LogOut className="w-4 h-4 opacity-70 group-hover:opacity-100" />
              Sign out
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 relative overflow-y-auto overflow-x-hidden pb-20 md:pb-0">
        {children}
      </main>

      {/* Mobile Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 glass border-t border-black/5 dark:border-white/5 z-50 px-6 py-3 flex items-center justify-between safe-area-bottom">
        <Link href="/dashboard" className="flex flex-col items-center gap-1 text-muted-foreground hover:text-primary transition-colors">
          <LayoutDashboard className="w-5 h-5" />
          <span className="text-[10px] font-medium">Home</span>
        </Link>
        <Link href="/dashboard/entries" className="flex flex-col items-center gap-1 text-muted-foreground hover:text-primary transition-colors">
          <PenLine className="w-5 h-5" />
          <span className="text-[10px] font-medium">Journal</span>
        </Link>
        <Link href="/dashboard/entries/new" className="flex flex-col items-center justify-center w-12 h-12 -mt-6 bg-primary text-primary-foreground rounded-full shadow-lg shadow-primary/25 ring-4 ring-background hover:scale-105 transition-transform">
          <PenLine className="w-5 h-5" />
        </Link>
        <Link href="/dashboard/calendar" className="flex flex-col items-center gap-1 text-muted-foreground hover:text-primary transition-colors">
          <Calendar className="w-5 h-5" />
          <span className="text-[10px] font-medium">Calendar</span>
        </Link>
        <Link href="/dashboard/settings" className="flex flex-col items-center gap-1 text-muted-foreground hover:text-primary transition-colors">
          <Settings className="w-5 h-5" />
          <span className="text-[10px] font-medium">Settings</span>
        </Link>
      </nav>
    </div>
  )
}

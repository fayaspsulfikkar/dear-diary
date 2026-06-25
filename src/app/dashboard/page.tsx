import { createClient } from '@/lib/supabase/server'
import { format } from 'date-fns'

export default async function DashboardPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  // Basic query for streaks/stats would go here
  // const { data: profile } = await supabase.from('profiles').select('*').eq('id', user?.id).single()

  const currentHour = new Date().getHours()
  const greeting = currentHour < 12 ? 'Good Morning' : currentHour < 18 ? 'Good Afternoon' : 'Good Evening'
  const today = format(new Date(), 'EEEE, MMMM do, yyyy')

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="space-y-8">
        {/* Header Section */}
        <div>
          <h1 className="text-4xl font-light tracking-tight text-foreground sm:text-5xl">
            {greeting} <span className="text-pink-400">❤️</span>
          </h1>
          <p className="mt-4 text-lg text-muted-foreground opacity-70">
            {today}
          </p>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          
          {/* Quick Write Card */}
          <div className="md:col-span-2 relative overflow-hidden rounded-3xl bg-pink-50 dark:bg-pink-950/20 p-8 shadow-sm ring-1 ring-black/5 dark:ring-white/5 transition-all hover:shadow-md">
            <h3 className="text-xl font-medium text-pink-900 dark:text-pink-100">Today's Prompt</h3>
            <p className="mt-4 text-pink-700/80 dark:text-pink-300/80 leading-relaxed text-lg italic">
              "What is one small thing that made you smile today?"
            </p>
            <div className="mt-8">
              <a href="/entries/new" className="inline-flex items-center justify-center rounded-xl bg-pink-500 px-6 py-3 text-sm font-medium text-white shadow-sm hover:bg-pink-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-500 transition-colors">
                Start Writing
              </a>
            </div>
            
            {/* Decorative blob */}
            <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-pink-200 dark:bg-pink-900/40 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
          </div>

          {/* Stats Column */}
          <div className="space-y-6">
            <div className="rounded-3xl bg-white/50 dark:bg-black/20 backdrop-blur-sm p-6 shadow-sm ring-1 ring-black/5 dark:ring-white/5 flex flex-col items-center justify-center text-center">
              <span className="text-5xl font-light text-foreground">3</span>
              <span className="mt-2 text-sm font-medium text-muted-foreground uppercase tracking-widest">Day Streak</span>
            </div>
            
            <div className="rounded-3xl bg-white/50 dark:bg-black/20 backdrop-blur-sm p-6 shadow-sm ring-1 ring-black/5 dark:ring-white/5 flex flex-col items-center justify-center text-center">
              <span className="text-4xl font-light text-foreground">1,240</span>
              <span className="mt-2 text-sm font-medium text-muted-foreground uppercase tracking-widest">Total Words</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

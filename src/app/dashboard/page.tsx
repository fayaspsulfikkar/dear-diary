import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }

  const { data: recentEntries } = await supabase
    .from('entries')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(1)

  const recentEntry = recentEntries?.[0]

  const { data: allDatesData } = await supabase
    .from('entries')
    .select('date')
    .eq('user_id', user.id)
    .order('date', { ascending: false })

  let streak = 0;
  if (allDatesData && allDatesData.length > 0) {
    const uniqueDates = [...new Set(allDatesData.map(d => d.date))];
    const today = new Date();
    const formatDate = (date: Date) => date.toISOString().split('T')[0];
    
    let todayStr = formatDate(today);
    let checkDate = new Date(today);
    checkDate.setDate(checkDate.getDate() - 1);
    let yesterdayStr = formatDate(checkDate);

    if (uniqueDates.includes(todayStr)) {
      streak = 1;
      let curr = new Date(today);
      curr.setDate(curr.getDate() - 1);
      while (uniqueDates.includes(formatDate(curr))) {
        streak++;
        curr.setDate(curr.getDate() - 1);
      }
    } else if (uniqueDates.includes(yesterdayStr)) {
      streak = 1;
      let curr = new Date(today);
      curr.setDate(curr.getDate() - 2);
      while (uniqueDates.includes(formatDate(curr))) {
        streak++;
        curr.setDate(curr.getDate() - 1);
      }
    }
  }

  const todayDateStr = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  })

  // Determine greeting
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good Morning' : hour < 18 ? 'Good Afternoon' : 'Good Evening'

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Date Header */}
      <div className="mb-12">
        <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest">{todayDateStr}</p>
      </div>

      <div className="relative">
        {/* Background glow */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[30rem] h-[30rem] bg-blush/40 dark:bg-blush/20 rounded-full blur-[100px] -z-10 mix-blend-multiply"></div>
        </div>
        
        {/* Hero Card */}
        <div className="glass rounded-[2rem] p-10 sm:p-14 relative overflow-hidden text-center flex flex-col items-center justify-center">
          <h1 className="text-4xl sm:text-5xl font-light tracking-tight text-foreground">
            {greeting}, <span className="font-normal">{user.user_metadata.full_name || 'Beautiful'}</span>
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-lg mx-auto">
            "What is one small thing that made you smile today?"
          </p>
          <div className="mt-10">
            <a href="/dashboard/entries/new" className="inline-flex items-center justify-center rounded-2xl bg-primary px-8 py-4 text-sm font-medium text-primary-foreground shadow-sm hover:opacity-90 transition-all active:scale-[0.98] duration-200">
              Start Writing
            </a>
          </div>
        </div>
      </div>

      {/* Grid of stats / recent */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <div className="glass rounded-3xl p-8 flex flex-col justify-between">
          <h3 className="text-lg font-medium text-foreground mb-4">Recent Memories</h3>
          {recentEntry ? (
            <div>
              <p className="text-foreground font-medium truncate">{recentEntry.title}</p>
              <p className="text-muted-foreground text-sm mt-1 line-clamp-2">
                {(recentEntry.content || '').replace(/<[^>]*>?/gm, '')}
              </p>
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">You haven't written recently.</p>
          )}
          <div className="mt-8">
            <a href="/dashboard/entries" className="text-primary text-sm font-medium hover:underline">View Journal &rarr;</a>
          </div>
        </div>
        
        <div className="glass rounded-3xl p-8 flex flex-col justify-between">
          <h3 className="text-lg font-medium text-foreground">Writing Streak</h3>
          <div className="flex items-end gap-2 mt-2">
            <span className="text-5xl font-light tracking-tighter text-foreground">{streak}</span>
            <span className="text-muted-foreground text-sm mb-2">Days</span>
          </div>
        </div>
      </div>

    </div>
  )
}

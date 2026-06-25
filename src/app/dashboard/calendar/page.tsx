'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { 
  format, 
  addMonths, 
  subMonths, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  isSameMonth, 
  isToday, 
  startOfWeek, 
  endOfWeek
} from 'date-fns'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [entries, setEntries] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function fetchEntries() {
      setIsLoading(true)
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const start = startOfMonth(currentDate)
      const end = endOfMonth(currentDate)
      
      const { data } = await supabase
        .from('entries')
        .select('id, date, title, mood')
        .eq('user_id', user.id)
        .gte('date', format(start, 'yyyy-MM-dd'))
        .lte('date', format(end, 'yyyy-MM-dd'))

      if (data) setEntries(data)
      setIsLoading(false)
    }

    fetchEntries()
  }, [currentDate])

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1))
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1))

  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(monthStart)
  const startDate = startOfWeek(monthStart)
  const endDate = endOfWeek(monthEnd)

  const calendarDays = eachDayOfInterval({ start: startDate, end: endDate })

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-16">
        <div>
          <h1 className="text-4xl sm:text-5xl font-light tracking-tight text-foreground">Calendar</h1>
          <p className="text-muted-foreground mt-3 text-lg">Your memories mapped out in time.</p>
        </div>
        <div className="flex items-center gap-4 bg-white/50 dark:bg-black/20 p-2 rounded-2xl glass self-start sm:self-auto">
          <button onClick={prevMonth} className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-xl transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="font-medium text-lg min-w-[140px] text-center">
            {format(currentDate, 'MMMM yyyy')}
          </span>
          <button onClick={nextMonth} className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-xl transition-colors">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="glass rounded-[2.5rem] p-6 sm:p-10 relative overflow-hidden">
        <div className="grid grid-cols-7 gap-px mb-4">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="text-center text-sm font-medium text-muted-foreground py-2 uppercase tracking-wider">
              {day}
            </div>
          ))}
        </div>
        
        <div className={`grid grid-cols-7 gap-2 sm:gap-4 transition-opacity duration-300 ${isLoading ? 'opacity-50' : 'opacity-100'}`}>
          {calendarDays.map((day) => {
            const dateStr = format(day, 'yyyy-MM-dd')
            const dayEntries = entries.filter(e => e.date === dateStr)
            const isCurrentMonth = isSameMonth(day, monthStart)
            
            return (
              <div 
                key={day.toString()} 
                className={`min-h-[80px] sm:min-h-[120px] p-2 sm:p-3 rounded-2xl border transition-all ${
                  !isCurrentMonth ? 'opacity-30 bg-transparent border-transparent' : 
                  isToday(day) ? 'bg-primary/5 border-primary/20 ring-1 ring-primary/20' : 
                  'bg-white dark:bg-white/5 border-black/5 dark:border-white/5 hover:border-black/10 dark:hover:border-white/10'
                }`}
              >
                <div className={`text-sm font-medium mb-2 ${isToday(day) ? 'text-primary' : 'text-foreground'}`}>
                  {format(day, 'd')}
                </div>
                
                <div className="flex flex-col gap-1.5">
                  {dayEntries.map(entry => (
                    <Link 
                      key={entry.id} 
                      href={`/dashboard/entries/${entry.id}`}
                      className="text-xs truncate block p-2 rounded-xl bg-blush text-blush-foreground hover:opacity-80 transition-opacity font-medium shadow-sm"
                      title={entry.title}
                    >
                      {entry.title || 'Untitled'}
                    </Link>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

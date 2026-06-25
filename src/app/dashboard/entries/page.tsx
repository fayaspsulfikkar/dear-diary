import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { format } from 'date-fns'
import { MOODS } from '@/components/shared/MoodSelector'
import { Plus } from 'lucide-react'

export default async function EntriesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: entries } = await supabase
    .from('entries')
    .select('*')
    .eq('user_id', user?.id)
    .order('created_at', { ascending: false })

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-light tracking-tight text-foreground">Your Journal</h1>
          <p className="text-muted-foreground mt-2">All your memories in one place.</p>
        </div>
        <Link 
          href="/dashboard/entries/new"
          className="flex items-center gap-2 bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-xl transition-colors shadow-sm font-medium"
        >
          <Plus className="w-4 h-4" />
          New Entry
        </Link>
      </div>

      {!entries || entries.length === 0 ? (
        <div className="text-center py-20 bg-white/50 dark:bg-black/20 backdrop-blur-sm rounded-3xl ring-1 ring-black/5 dark:ring-white/5">
          <p className="text-lg text-muted-foreground">Your diary is empty.</p>
          <p className="text-sm text-muted-foreground/70 mt-2 mb-6">Write your first entry today!</p>
          <Link 
            href="/dashboard/entries/new"
            className="inline-flex items-center gap-2 bg-pink-100 hover:bg-pink-200 text-pink-700 dark:bg-pink-900/30 dark:hover:bg-pink-900/50 dark:text-pink-300 px-6 py-3 rounded-xl transition-colors font-medium"
          >
            Start Writing
          </Link>
        </div>
      ) : (
        <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-pink-200 dark:before:via-pink-900/50 before:to-transparent">
          {entries.map((entry) => {
            const mood = MOODS.find(m => m.value === entry.mood) || MOODS[0]
            
            return (
              <div key={entry.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                {/* Timeline dot */}
                <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-background bg-pink-100 dark:bg-pink-900/50 text-xl shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                  {mood.emoji}
                </div>
                
                {/* Card */}
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-2xl bg-white/50 dark:bg-black/20 backdrop-blur-sm shadow-sm ring-1 ring-black/5 dark:ring-white/5 hover:ring-pink-500/20 hover:shadow-md transition-all group-hover:-translate-y-1">
                  <Link href={`/dashboard/entries/${entry.id}`} className="block">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-lg text-foreground line-clamp-1">{entry.title}</h3>
                      <time className="text-xs text-muted-foreground bg-black/5 dark:bg-white/5 px-2 py-1 rounded-md shrink-0">
                        {format(new Date(entry.created_at), 'MMM d, yyyy')}
                      </time>
                    </div>
                    {/* Convert HTML content to plain text snippet roughly */}
                    <p className="text-muted-foreground text-sm line-clamp-3 mb-4 opacity-80">
                      {entry.content.replace(/<[^>]*>?/gm, '')}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground opacity-70">
                      <span>{entry.word_count || 0} words</span>
                      <span>•</span>
                      <span>{entry.reading_time || 1} min read</span>
                    </div>
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { format } from 'date-fns'
import { MOODS } from '@/components/shared/MoodSelector'
import { Plus } from 'lucide-react'

export default function EntriesTimeline({ initialEntries, userId }: { initialEntries: any[], userId: string }) {
  const [entries, setEntries] = useState<any[]>(initialEntries)
  const [page, setPage] = useState(1)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(initialEntries.length === 10)
  const supabase = createClient()

  const loadMore = async () => {
    if (isLoadingMore || !hasMore) return
    setIsLoadingMore(true)

    const from = page * 10
    const to = from + 9

    const { data } = await supabase
      .from('entries')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range(from, to)

    if (data && data.length > 0) {
      setEntries([...entries, ...data])
      setPage(page + 1)
      if (data.length < 10) {
        setHasMore(false)
      }
    } else {
      setHasMore(false)
    }

    setIsLoadingMore(false)
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <div className="flex items-center justify-between mb-16">
        <div>
          <h1 className="text-5xl sm:text-6xl font-serif text-foreground drop-shadow-sm">Your Journal</h1>
          <p className="text-muted-foreground mt-3 text-lg font-light tracking-wide">All your beautiful memories in one place.</p>
        </div>
        <Link 
          href="/dashboard/entries/new"
          className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3.5 rounded-full transition-all shadow-[0_4px_20px_-4px_rgba(197,139,134,0.4)] font-medium active:scale-[0.98] duration-300"
        >
          <Plus className="w-5 h-5" strokeWidth={1.5} />
          <span className="hidden sm:inline">New Memory</span>
        </Link>
      </div>

      {!entries || entries.length === 0 ? (
        <div className="text-center py-32 glass rounded-[3rem]">
          <p className="text-2xl font-serif text-foreground">Your diary is empty.</p>
          <p className="text-muted-foreground mt-3 mb-10 max-w-sm mx-auto font-light">Start writing to see your memories appear here in a beautiful timeline.</p>
          <Link 
            href="/dashboard/entries/new"
            className="inline-flex items-center gap-2 bg-blush text-blush-foreground px-10 py-4 rounded-full transition-all font-medium hover:bg-blush/80 active:scale-[0.98] duration-300 shadow-sm"
          >
            Write your first entry
          </Link>
        </div>
      ) : (
        <>
          <div className="space-y-12 relative before:absolute before:inset-0 before:ml-6 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-px before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
            {entries.map((entry) => {
              const mood = MOODS.find(m => m.value === entry.mood) || MOODS[0]
              
              return (
                <div key={entry.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  {/* Timeline dot */}
                  <div className="flex items-center justify-center w-14 h-14 rounded-full bg-background border-2 border-primary/20 text-2xl shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-[0_0_0_8px_var(--background)] transition-transform duration-500 group-hover:scale-110 group-hover:border-primary/50">
                    {mood.emoji}
                  </div>
                  
                  {/* Card */}
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-4rem)] p-8 glass rounded-[2.5rem] transition-all duration-500 group-hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(197,139,134,0.15)] dark:hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)]">
                    <Link href={`/dashboard/entries/${entry.id}`} className="block">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-5 gap-2">
                        <h3 className="font-serif text-2xl text-foreground line-clamp-1 pr-4 flex items-center gap-2">
                          {entry.title}
                          {entry.is_favorite && (
                            <svg className="w-5 h-5 text-primary fill-current shrink-0" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                          )}
                        </h3>
                        <time className="text-xs font-medium text-primary bg-primary/10 px-3 py-1.5 rounded-full shrink-0 tracking-wide uppercase">
                          {format(new Date(entry.created_at), 'MMM d, yyyy')}
                        </time>
                      </div>
                      <p className="text-muted-foreground text-sm line-clamp-3 mb-6 opacity-90 leading-relaxed font-light">
                        {(entry.content || '').replace(/<[^>]*>?/gm, '')}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground/60 uppercase tracking-wider font-medium">
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
          
          {hasMore && (
            <div className="mt-16 text-center">
              <button 
                onClick={loadMore}
                disabled={isLoadingMore}
                className="inline-flex items-center gap-2 bg-white/50 dark:bg-black/20 hover:bg-black/5 dark:hover:bg-white/5 text-foreground px-6 py-3 rounded-2xl transition-all font-medium border border-black/5 dark:border-white/5 disabled:opacity-50"
              >
                {isLoadingMore ? 'Loading...' : 'Load Older Memories'}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

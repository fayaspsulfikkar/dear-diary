import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { format } from 'date-fns'
import { MOODS } from '@/components/shared/MoodSelector'

export default async function FavoritesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: entries } = await supabase
    .from('entries')
    .select('*')
    .eq('user_id', user!.id)
    .eq('is_favorite', true)
    .order('created_at', { ascending: false })

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between mb-16">
        <div>
          <h1 className="text-4xl sm:text-5xl font-light tracking-tight text-foreground">Favorites</h1>
          <p className="text-muted-foreground mt-3 text-lg">The memories you cherish the most.</p>
        </div>
      </div>

      {!entries || entries.length === 0 ? (
        <div className="text-center py-32 glass rounded-[2rem]">
          <p className="text-xl font-light text-foreground">No favorites yet.</p>
          <p className="text-muted-foreground mt-3 mb-8 max-w-sm mx-auto">Star your favorite entries to see them appear here.</p>
          <Link 
            href="/dashboard/entries"
            className="inline-flex items-center gap-2 bg-blush text-blush-foreground px-8 py-4 rounded-2xl transition-all font-medium hover:bg-blush/80 active:scale-[0.98] duration-200"
          >
            View Journal
          </Link>
        </div>
      ) : (
        <div className="space-y-12 relative before:absolute before:inset-0 before:ml-6 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-px before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
          {entries.map((entry) => {
            const mood = MOODS.find(m => m.value === entry.mood) || MOODS[0]
            
            return (
              <div key={entry.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                {/* Timeline dot */}
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blush text-2xl shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-[0_0_0_8px_var(--background)] ring-1 ring-black/5 dark:ring-white/5">
                  {mood.emoji}
                </div>
                
                {/* Card */}
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] p-6 glass rounded-3xl transition-all duration-300 group-hover:-translate-y-1 hover:shadow-lg hover:shadow-black/5 dark:hover:shadow-white/5">
                  <Link href={`/dashboard/entries/${entry.id}`} className="block">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-normal text-xl text-foreground line-clamp-1 pr-4 flex items-center gap-2">
                        {entry.title}
                        <svg className="w-4 h-4 text-yellow-500 fill-current shrink-0" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                      </h3>
                      <time className="text-xs font-medium text-muted-foreground bg-muted px-2.5 py-1 rounded-lg shrink-0">
                        {format(new Date(entry.created_at), 'MMM d, yyyy')}
                      </time>
                    </div>
                    {/* Convert HTML content to plain text snippet roughly */}
                    <p className="text-muted-foreground text-sm line-clamp-3 mb-4 opacity-80">
                      {(entry.content || '').replace(/<[^>]*>?/gm, '')}
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

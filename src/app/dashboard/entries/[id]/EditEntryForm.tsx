'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Editor from '@/components/editor/Editor'
import MoodSelector from '@/components/shared/MoodSelector'
import { format } from 'date-fns'
import { Star } from 'lucide-react'

export default function EditEntryForm({ initialData }: { initialData: any }) {
  const router = useRouter()
  const supabase = createClient()
  
  const [title, setTitle] = useState(initialData.title || '')
  const [content, setContent] = useState(initialData.content || '')
  const [text, setText] = useState('') // This gets updated by the editor on mount
  const [mood, setMood] = useState<string>(initialData.mood || 'happy')
  const [isFavorite, setIsFavorite] = useState<boolean>(initialData.is_favorite || false)
  const [entryId, setEntryId] = useState<string>(initialData.id)
  
  const [isSaving, setIsSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(new Date(initialData.updated_at || initialData.created_at))

  // Determine word count correctly when text is updated
  const wordCount = text.trim() === '' ? (initialData.word_count || 0) : text.trim().split(/\s+/).length
  const readingTime = Math.max(1, Math.ceil(wordCount / 200)) 

  const handleSave = async (isManual = false) => {
    if (!title && !text) return // Don't save empty entries
    
    setIsSaving(true)
    
    const payload = {
      title: title || 'Untitled Entry',
      content,
      mood,
      is_favorite: isFavorite,
      word_count: wordCount,
      reading_time: readingTime,
      updated_at: new Date().toISOString()
    }

    const { error } = await supabase
      .from('entries')
      .update(payload)
      .eq('id', entryId)
      
    if (!error) {
      setLastSaved(new Date())
    }
    
    setIsSaving(false)
  }

  // Auto-save effect
  useEffect(() => {
    // Only auto-save if something has changed since mount to avoid unnecessary writes
    if (title === initialData.title && content === initialData.content && mood === initialData.mood && isFavorite === (initialData.is_favorite || false)) {
      return
    }

    const timer = setTimeout(() => {
      handleSave()
    }, 5000)

    return () => clearTimeout(timer)
  }, [title, content, mood, isFavorite])

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground opacity-70">
          {format(new Date(initialData.created_at), 'EEEE, MMMM do, yyyy')}
        </div>
        <div className="flex items-center gap-4 text-sm">
          {isSaving ? (
            <span className="text-muted-foreground animate-pulse">Saving...</span>
          ) : lastSaved ? (
            <span className="text-muted-foreground">Saved at {format(lastSaved, 'h:mm a')}</span>
          ) : null}
          <button
            onClick={() => setIsFavorite(!isFavorite)}
            className={`p-2 rounded-lg transition-colors ${isFavorite ? 'text-yellow-500 bg-yellow-50 dark:bg-yellow-500/10' : 'text-muted-foreground hover:bg-black/5 dark:hover:bg-white/5'}`}
            title="Favorite"
          >
            <Star className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
          <button 
            onClick={() => handleSave(true)}
            className="px-4 py-2 bg-pink-100 text-pink-700 hover:bg-pink-200 dark:bg-pink-900/30 dark:text-pink-300 dark:hover:bg-pink-900/50 rounded-lg transition-colors font-medium"
          >
            Save
          </button>
        </div>
      </div>

      <div>
        <input
          type="text"
          placeholder="Entry Title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full bg-transparent text-4xl sm:text-5xl font-light tracking-tight text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-0 border-0 p-0"
        />
      </div>

      <div>
        <h3 className="text-sm font-medium text-muted-foreground mb-3">How are you feeling?</h3>
        <MoodSelector selectedMood={mood} onChange={setMood} />
      </div>

      <div className="min-h-[400px] mt-8">
        <Editor 
          initialContent={initialData.content} 
          onChange={(html, rawText) => {
            setContent(html)
            setText(rawText)
          }} 
        />
      </div>

      <div className="flex items-center gap-4 text-xs text-muted-foreground opacity-70 border-t border-black/5 dark:border-white/5 pt-4">
        <span>{wordCount} words</span>
        <span>•</span>
        <span>{readingTime} min read</span>
      </div>
    </div>
  )
}

'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Editor from '@/components/editor/Editor'
import MoodSelector from '@/components/shared/MoodSelector'
import { format } from 'date-fns'

export default function NewEntryForm() {
  const router = useRouter()
  const supabase = createClient()
  
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [text, setText] = useState('')
  const [mood, setMood] = useState<string>('happy')
  const [entryId, setEntryId] = useState<string | null>(null)
  
  const [isSaving, setIsSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)

  const wordCount = text.trim() === '' ? 0 : text.trim().split(/\s+/).length
  const readingTime = Math.max(1, Math.ceil(wordCount / 200)) // Assuming 200 words per minute

  const handleSave = async (isManual = false) => {
    if (!title && !text) return // Don't save empty entries
    
    setIsSaving(true)
    
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) return

    const payload = {
      title: title || 'Untitled Entry',
      content,
      mood,
      word_count: wordCount,
      reading_time: readingTime,
      user_id: user.id
    }

    if (entryId) {
      // Update existing
      const { error } = await supabase
        .from('entries')
        .update(payload)
        .eq('id', entryId)
        
      if (!error) {
        setLastSaved(new Date())
      }
    } else {
      // Insert new
      const { data, error } = await supabase
        .from('entries')
        .insert(payload)
        .select()
        .single()
        
      if (!error && data) {
        setEntryId(data.id)
        setLastSaved(new Date())
        // Replace URL silently to avoid creating a new entry on refresh
        window.history.replaceState(null, '', `/dashboard/entries/${data.id}`)
      }
    }
    
    setIsSaving(false)
  }

  // Auto-save effect
  useEffect(() => {
    const timer = setTimeout(() => {
      if (title || text) {
        handleSave()
      }
    }, 5000) // Auto-save every 5 seconds if there are changes

    return () => clearTimeout(timer)
  }, [title, content, mood])

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground opacity-70">
          {format(new Date(), 'EEEE, MMMM do, yyyy')}
        </div>
        <div className="flex items-center gap-4 text-sm">
          {isSaving ? (
            <span className="text-muted-foreground animate-pulse">Saving...</span>
          ) : lastSaved ? (
            <span className="text-muted-foreground">Saved at {format(lastSaved, 'h:mm a')}</span>
          ) : null}
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
          initialContent="" 
          onChange={(html, rawText) => {
            setContent(html)
            setText(rawText)
          }} 
        />
      </div>

      <div className="flex items-center gap-4 text-xs text-muted-foreground opacity-70 border-t border-black/5 dark:border-white/5 pt-4">
        <span>{wordCount} words</span>
        <span>•</span>
        <span>{text.length} characters</span>
        <span>•</span>
        <span>{readingTime} min read</span>
      </div>
    </div>
  )
}

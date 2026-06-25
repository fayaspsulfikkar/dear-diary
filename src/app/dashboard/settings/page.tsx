'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Save } from 'lucide-react'
import { useTheme } from 'next-themes'

export default function SettingsPage() {
  const [profile, setProfile] = useState<any>(null)
  const [name, setName] = useState('')
  const [dailyGoal, setDailyGoal] = useState(300)
  const [fontPref, setFontPref] = useState('sans')
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState('')
  const supabase = createClient()
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    async function fetchProfile() {
      setIsLoading(true)
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()
        
        if (data) {
          setProfile(data)
          setName(data.name || '')
          setDailyGoal(data.daily_goal_words || 300)
          setFontPref(data.font_preference || 'sans')
        }
      }
      setIsLoading(false)
    }
    fetchProfile()
  }, [])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!profile) return

    setIsSaving(true)
    setSaveMessage('')

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { error } = await supabase
      .from('profiles')
      .update({
        name,
        daily_goal_words: dailyGoal,
        font_preference: fontPref,
        theme_preference: theme === 'system' ? 'system' : theme,
      })
      .eq('id', user.id)

    if (error) {
      setSaveMessage('Failed to save settings.')
    } else {
      setSaveMessage('Settings saved successfully!')
      // Synchronize full_name metadata with auth system
      await supabase.auth.updateUser({
        data: { full_name: name }
      })
    }

    setIsSaving(false)
    setTimeout(() => setSaveMessage(''), 3000)
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="mb-12">
        <h1 className="text-4xl sm:text-5xl font-light tracking-tight text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-3 text-lg">Customize your Dear Diary experience.</p>
      </div>

      <div className="glass rounded-[2rem] p-8 sm:p-12">
        {isLoading ? (
          <div className="animate-pulse space-y-6">
            <div className="h-10 bg-black/5 dark:bg-white/5 rounded-xl w-full"></div>
            <div className="h-10 bg-black/5 dark:bg-white/5 rounded-xl w-full"></div>
          </div>
        ) : (
          <form onSubmit={handleSave} className="space-y-8">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">Display Name</label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                placeholder="Your name"
              />
            </div>

            <div>
              <label htmlFor="dailyGoal" className="block text-sm font-medium text-foreground mb-2">Daily Word Goal</label>
              <input
                id="dailyGoal"
                type="number"
                min="10"
                step="10"
                value={dailyGoal}
                onChange={(e) => setDailyGoal(Number(e.target.value))}
                className="w-full bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                placeholder="300"
              />
              <p className="text-xs text-muted-foreground mt-2">Setting a daily word goal helps you build a consistent journaling habit.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div>
                <label htmlFor="theme" className="block text-sm font-medium text-foreground mb-2">Theme</label>
                <select
                  id="theme"
                  value={theme}
                  onChange={(e) => setTheme(e.target.value)}
                  className="w-full bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all appearance-none"
                >
                  <option value="system">System Default</option>
                  <option value="light">Light Mode</option>
                  <option value="dark">Dark Mode</option>
                </select>
              </div>

              <div>
                <label htmlFor="font" className="block text-sm font-medium text-foreground mb-2">Typography</label>
                <select
                  id="font"
                  value={fontPref}
                  onChange={(e) => setFontPref(e.target.value)}
                  className="w-full bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all appearance-none"
                >
                  <option value="sans">Modern (Sans-serif)</option>
                  <option value="serif">Elegant (Serif)</option>
                </select>
                <p className="text-xs text-muted-foreground mt-2">Requires a page refresh to take effect.</p>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between border-t border-black/5 dark:border-white/5">
              <p className={`text-sm ${saveMessage.includes('Failed') ? 'text-red-500' : 'text-green-500'}`}>
                {saveMessage}
              </p>
              <button
                type="submit"
                disabled={isSaving}
                className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 font-medium shadow-sm"
              >
                <Save className="w-4 h-4" />
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

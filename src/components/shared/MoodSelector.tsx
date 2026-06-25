'use client'

import { useState } from 'react'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const MOODS = [
  { emoji: '😊', label: 'Happy', value: 'happy' },
  { emoji: '😄', label: 'Excited', value: 'excited' },
  { emoji: '❤️', label: 'Loved', value: 'loved' },
  { emoji: '😐', label: 'Neutral', value: 'neutral' },
  { emoji: '😢', label: 'Sad', value: 'sad' },
  { emoji: '😡', label: 'Angry', value: 'angry' },
  { emoji: '😴', label: 'Tired', value: 'tired' },
  { emoji: '😰', label: 'Anxious', value: 'anxious' },
]

export default function MoodSelector({
  selectedMood,
  onChange,
}: {
  selectedMood?: string
  onChange: (mood: string) => void
}) {
  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label="Select your mood">
      {MOODS.map((mood) => (
        <button
          key={mood.value}
          type="button"
          onClick={() => onChange(mood.value)}
          title={mood.label}
          aria-label={mood.label}
          aria-pressed={selectedMood === mood.value}
          className={cn(
            'flex items-center justify-center w-10 h-10 rounded-full text-xl transition-all duration-200 ring-1',
            selectedMood === mood.value
              ? 'bg-pink-100 ring-pink-400 dark:bg-pink-900/50 shadow-sm scale-110'
              : 'bg-white/50 ring-black/5 dark:bg-black/20 dark:ring-white/10 hover:bg-black/5 dark:hover:bg-white/5 hover:scale-105 opacity-70 hover:opacity-100'
          )}
        >
          {mood.emoji}
        </button>
      ))}
    </div>
  )
}

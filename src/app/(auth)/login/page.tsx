'use client'

import { useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Book } from 'lucide-react'

function LoginContent() {
  const [isLoading, setIsLoading] = useState(false)
  const supabase = createClient()
  const searchParams = useSearchParams()
  const errorMsg = searchParams.get('error')

  const handleGoogleLogin = async () => {
    setIsLoading(true)
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    
    if (error) {
      console.error(error)
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blush/80 dark:bg-blush/40 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary/30 dark:bg-primary/20 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      
      <div className="w-full max-w-md p-10 sm:p-12 glass rounded-[2.5rem] relative z-10 animate-in fade-in zoom-in duration-700">
        <div className="absolute inset-0 rounded-[2.5rem] ring-1 ring-inset ring-white/40 dark:ring-white/5 pointer-events-none"></div>
        
        <div className="text-center mb-12 relative z-10">
          <div className="mx-auto w-16 h-16 bg-blush rounded-2xl flex items-center justify-center mb-8 shadow-[inset_0_1px_0_rgba(255,255,255,0.4)] dark:shadow-none ring-1 ring-black/5 dark:ring-white/10">
            <Book className="w-8 h-8 text-blush-foreground" />
          </div>
          <h1 className="text-3xl font-light tracking-tight text-foreground">Dear Diary</h1>
          <p className="text-muted-foreground mt-4 text-sm font-medium">Your private, beautiful space.</p>
          
          {errorMsg && (
            <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm rounded-xl border border-red-100 dark:border-red-900/50">
              {errorMsg}
            </div>
          )}
        </div>

        <button
          onClick={handleGoogleLogin}
          disabled={isLoading}
          className="w-full relative z-10 flex items-center justify-center gap-3 bg-white dark:bg-[#111111] text-foreground font-medium py-3.5 px-4 rounded-2xl ring-1 ring-black/5 dark:ring-white/10 hover:shadow-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary/50 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <span className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></span>
          ) : (
            <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden="true">
              <path d="M12.0003 4.75C13.7703 4.75 15.3553 5.36002 16.6053 6.54998L20.0303 3.125C17.9502 1.19 15.2353 0 12.0003 0C7.31028 0 3.25527 2.69 1.28027 6.60998L5.27028 9.70498C6.21525 6.86002 8.87028 4.75 12.0003 4.75Z" fill="#EA4335" />
              <path d="M23.49 12.275C23.49 11.49 23.415 10.73 23.3 10H12V14.51H18.47C18.18 15.99 17.34 17.25 16.08 18.1L19.945 21.1C22.2 19.01 23.49 15.92 23.49 12.275Z" fill="#4285F4" />
              <path d="M5.26498 14.2949C5.02498 13.5699 4.88501 12.7999 4.88501 11.9999C4.88501 11.1999 5.01998 10.4299 5.26498 9.7049L1.275 6.60986C0.46 8.22986 0 10.0599 0 11.9999C0 13.9399 0.46 15.7699 1.28 17.3899L5.26498 14.2949Z" fill="#FBBC05" />
              <path d="M12.0004 24.0001C15.2404 24.0001 17.9654 22.935 19.9454 21.095L16.0804 18.095C15.0054 18.82 13.6204 19.245 12.0004 19.245C8.8704 19.245 6.21537 17.135 5.26538 14.29L1.27539 17.385C3.25539 21.31 7.3104 24.0001 12.0004 24.0001Z" fill="#34A853" />
            </svg>
          )}
          Continue with Google
        </button>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <LoginContent />
    </Suspense>
  )
}

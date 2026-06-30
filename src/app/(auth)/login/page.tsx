'use client'

import { useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Book, Mail, Lock } from 'lucide-react'

function LoginContent() {
  const [isLoading, setIsLoading] = useState(false)
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [authError, setAuthError] = useState<string | null>(null)
  
  const supabase = createClient()
  const searchParams = useSearchParams()
  const errorMsg = searchParams.get('error')

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setAuthError(null)
    
    if (isSignUp) {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })
      if (error) {
        setAuthError(error.message)
      } else {
        setAuthError('Check your email for the confirmation link.')
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) {
        setAuthError(error.message)
      } else {
        window.location.href = '/dashboard'
      }
    }
    
    setIsLoading(false)
  }

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
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-background via-blush/30 to-background">
      {/* Decorative blobs */}
      <div className="absolute top-1/4 left-1/4 w-[40rem] h-[40rem] bg-blush/60 dark:bg-blush/20 rounded-full mix-blend-multiply filter blur-[100px] opacity-40 animate-blob"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[35rem] h-[35rem] bg-primary/20 dark:bg-primary/10 rounded-full mix-blend-multiply filter blur-[100px] opacity-40 animate-blob animation-delay-2000"></div>
      
      <div className="w-full max-w-md p-10 sm:p-12 glass rounded-[3rem] relative z-10 animate-in fade-in zoom-in duration-1000 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] dark:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)]">
        <div className="absolute inset-0 rounded-[3rem] ring-1 ring-inset ring-primary/20 pointer-events-none"></div>
        
        <div className="text-center mb-10 relative z-10">
          <div className="mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-6 border border-primary/30 bg-white/30 dark:bg-black/30 backdrop-blur-sm">
            <Book className="w-7 h-7 text-primary/80" strokeWidth={1.5} />
          </div>
          <h1 className="text-5xl text-primary font-script mb-2 drop-shadow-sm">Dear Diary</h1>
          <p className="text-muted-foreground mt-4 text-xs tracking-[0.2em] uppercase font-serif">A Private Sanctuary</p>
          
          {(errorMsg || authError) && (
            <div className={`mt-4 p-3 text-sm rounded-xl border ${
              authError?.includes('Check your email') 
                ? 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border-green-100 dark:border-green-900/50'
                : 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border-red-100 dark:border-red-900/50'
            }`}>
              {authError || errorMsg}
            </div>
          )}
        </div>

        <div className="relative z-10">
          <form onSubmit={handleEmailAuth} className="space-y-4 mb-6">
            <div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-muted-foreground/60" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email address"
                  required
                  className="block w-full pl-10 pr-3 py-3 border border-primary/20 rounded-2xl bg-white/50 dark:bg-black/20 focus:outline-none focus:ring-2 focus:ring-primary/50 backdrop-blur-sm transition-all text-sm placeholder:text-muted-foreground/60"
                />
              </div>
            </div>
            
            <div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-muted-foreground/60" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  required
                  className="block w-full pl-10 pr-3 py-3 border border-primary/20 rounded-2xl bg-white/50 dark:bg-black/20 focus:outline-none focus:ring-2 focus:ring-primary/50 backdrop-blur-sm transition-all text-sm placeholder:text-muted-foreground/60"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center py-3.5 px-4 border border-transparent rounded-2xl shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {isLoading ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              ) : (
                isSignUp ? 'Create Account' : 'Sign In'
              )}
            </button>
            
            <div className="text-center mt-4">
              <button
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-xs text-muted-foreground hover:text-primary transition-colors"
              >
                {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
              </button>
            </div>
          </form>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-primary/10"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-2 bg-transparent text-muted-foreground/60">OR</span>
            </div>
          </div>

          <button
            onClick={handleGoogleLogin}
            disabled={isLoading}
            type="button"
            className="w-full flex items-center justify-center gap-3 bg-white dark:bg-[#111111] text-foreground font-medium py-3.5 px-4 rounded-2xl ring-1 ring-black/5 dark:ring-white/10 hover:shadow-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary/50 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden="true">
              <path d="M12.0003 4.75C13.7703 4.75 15.3553 5.36002 16.6053 6.54998L20.0303 3.125C17.9502 1.19 15.2353 0 12.0003 0C7.31028 0 3.25527 2.69 1.28027 6.60998L5.27028 9.70498C6.21525 6.86002 8.87028 4.75 12.0003 4.75Z" fill="#EA4335" />
              <path d="M23.49 12.275C23.49 11.49 23.415 10.73 23.3 10H12V14.51H18.47C18.18 15.99 17.34 17.25 16.08 18.1L19.945 21.1C22.2 19.01 23.49 15.92 23.49 12.275Z" fill="#4285F4" />
              <path d="M5.26498 14.2949C5.02498 13.5699 4.88501 12.7999 4.88501 11.9999C4.88501 11.1999 5.01998 10.4299 5.26498 9.7049L1.275 6.60986C0.46 8.22986 0 10.0599 0 11.9999C0 13.9399 0.46 15.7699 1.28 17.3899L5.26498 14.2949Z" fill="#FBBC05" />
              <path d="M12.0004 24.0001C15.2404 24.0001 17.9654 22.935 19.9454 21.095L16.0804 18.095C15.0054 18.82 13.6204 19.245 12.0004 19.245C8.8704 19.245 6.21537 17.135 5.26538 14.29L1.27539 17.385C3.25539 21.31 7.3104 24.0001 12.0004 24.0001Z" fill="#34A853" />
            </svg>
            Continue with Google
          </button>
        </div>
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

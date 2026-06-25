import { login, signup } from './actions'

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 rounded-2xl bg-white/50 p-8 shadow-xl backdrop-blur-lg dark:bg-black/50 ring-1 ring-black/5 dark:ring-white/10">
        <div>
          <h2 className="mt-6 text-center text-3xl font-light tracking-tight text-foreground">
            Dear Diary
          </h2>
          <p className="mt-2 text-center text-sm text-muted-foreground opacity-70">
            A private space for your thoughts
          </p>
        </div>
        <form className="mt-8 space-y-6">
          <div className="space-y-4 rounded-md shadow-sm">
            <div>
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="relative block w-full rounded-xl border-0 py-3 px-4 text-foreground bg-background/50 ring-1 ring-inset ring-black/10 dark:ring-white/10 placeholder:text-muted-foreground focus:z-10 focus:ring-2 focus:ring-inset focus:ring-pink-400 sm:text-sm sm:leading-6 transition-all duration-200"
                placeholder="Email address"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="relative block w-full rounded-xl border-0 py-3 px-4 text-foreground bg-background/50 ring-1 ring-inset ring-black/10 dark:ring-white/10 placeholder:text-muted-foreground focus:z-10 focus:ring-2 focus:ring-inset focus:ring-pink-400 sm:text-sm sm:leading-6 transition-all duration-200"
                placeholder="Password"
              />
            </div>
          </div>

          <div className="flex flex-col space-y-3">
            <button
              formAction={login}
              className="group relative flex w-full justify-center rounded-xl bg-foreground px-3 py-3 text-sm font-medium text-background hover:bg-foreground/90 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:ring-offset-2 transition-all duration-200"
            >
              Log in
            </button>
            <button
              formAction={signup}
              className="group relative flex w-full justify-center rounded-xl bg-pink-100 dark:bg-pink-900/30 px-3 py-3 text-sm font-medium text-pink-700 dark:text-pink-300 hover:bg-pink-200 dark:hover:bg-pink-900/50 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:ring-offset-2 transition-all duration-200"
            >
              Sign up
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function DashboardLoading() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 animate-pulse">
      <div className="mb-12">
        <div className="h-4 w-48 bg-black/5 dark:bg-white/5 rounded-full"></div>
      </div>
      
      <div className="glass rounded-[2rem] p-10 sm:p-14 mb-8 flex flex-col items-center justify-center">
        <div className="h-12 w-3/4 max-w-md bg-black/5 dark:bg-white/5 rounded-full mb-6"></div>
        <div className="h-6 w-1/2 max-w-sm bg-black/5 dark:bg-white/5 rounded-full mb-10"></div>
        <div className="h-12 w-40 bg-primary/20 rounded-2xl"></div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass rounded-3xl p-8 h-48 bg-black/5 dark:bg-white/5"></div>
        <div className="glass rounded-3xl p-8 h-48 bg-black/5 dark:bg-white/5"></div>
      </div>
    </div>
  )
}

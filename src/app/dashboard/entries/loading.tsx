export default function EntriesLoading() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 animate-pulse">
      <div className="flex items-center justify-between mb-16">
        <div>
          <div className="h-12 w-64 bg-black/5 dark:bg-white/5 rounded-full mb-4"></div>
          <div className="h-6 w-48 bg-black/5 dark:bg-white/5 rounded-full"></div>
        </div>
        <div className="h-12 w-32 bg-primary/20 rounded-2xl"></div>
      </div>
      
      <div className="space-y-12 relative before:absolute before:inset-0 before:ml-6 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-px before:bg-border/50">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
            {/* Timeline dot */}
            <div className="w-12 h-12 rounded-full bg-black/10 dark:bg-white/10 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-[0_0_0_8px_var(--background)]"></div>
            
            {/* Card */}
            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] h-32 glass rounded-3xl"></div>
          </div>
        ))}
      </div>
    </div>
  )
}

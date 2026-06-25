import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import NewEntryForm from '../new/NewEntryForm'

// We reuse NewEntryForm but pass it the existing entry data
// For now, to keep it simple, I'll create a EditEntryForm or just pass props.
// Wait, I should make NewEntryForm accept initialData.

// Wait, since NewEntryForm doesn't accept props yet, I'll create EditEntryForm.
// Let's modify NewEntryForm later or create EditEntryForm.
// I'll create a dedicated EditEntryForm here.
import EditEntryForm from './EditEntryForm'

export default async function EntryPage({ params }: { params: { id: string } }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  const { data: entry } = await supabase
    .from('entries')
    .select('*')
    .eq('id', params.id)
    .eq('user_id', user?.id)
    .single()

  if (!entry) {
    notFound()
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <EditEntryForm initialData={entry} />
    </div>
  )
}

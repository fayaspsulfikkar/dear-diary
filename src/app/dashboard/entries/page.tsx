import { createClient } from '@/lib/supabase/server'
import EntriesTimeline from './EntriesTimeline'

export default async function EntriesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: entries } = await supabase
    .from('entries')
    .select('*')
    .eq('user_id', user!.id)
    .order('created_at', { ascending: false })
    .limit(10)

  return <EntriesTimeline initialEntries={entries || []} userId={user!.id} />
}

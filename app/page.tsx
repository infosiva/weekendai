import { getContentOverrides } from '@/lib/content'
import WeekendAIPage from './WeekendAIPage'

export default async function Page() {
  const overrides = await getContentOverrides()
  return <WeekendAIPage overrides={overrides} />
}

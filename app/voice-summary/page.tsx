import VoiceSummaryLayout from "@/components/layouts/voice-summary-layout"
import VoiceSummaryHeader from "@/components/voice-summary/voice-summary-header"
import VoiceSummaryContent from "@/components/voice-summary/voice-summary-content"
import { getVoiceRecordings } from "@/lib/api/voice-summary-api"

export default async function VoiceSummaryPage() {
  // In a real app, this would use server-side data fetching
  const recordings = await getVoiceRecordings()

  return (
    <VoiceSummaryLayout>
      <div className="flex flex-col gap-6">
        <VoiceSummaryHeader />
        <VoiceSummaryContent initialRecordings={recordings} />
      </div>
    </VoiceSummaryLayout>
  )
}

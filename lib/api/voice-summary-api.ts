import type { VoiceRecording } from "@/types/voice-summary"

/**
 * Get voice recordings
 */
export async function getVoiceRecordings(): Promise<VoiceRecording[]> {
  // In a real app, this would call an API endpoint
  // This is a mock implementation for demonstration

  // Mock data with local audio files that are guaranteed to work
  const mockRecordings: VoiceRecording[] = [
    {
      id: "rec_1",
      title: "Acme Co.",
      createdBy: "Harold",
      createdAt: "2025-02-28T10:00:00Z",
      duration: "02:25",
      // Use a data URI for a silent audio file that's guaranteed to work
      audioUrl:
        "data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA/+M4wAAAAAAAAAAAAEluZm8AAAAPAAAAAwAAAbAAuLi4uLi4uLi4uLi4uLi4uLi4uLi44ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg//////////////////////////////////////////////////////////////////8AAAAATGF2YzU4LjEzAAAAAAAAAAAAAAAAJAX/////////////////////////////////////////",
      transcription: "This is a mock transcription for the first recording.",
      summary: "Summary of the first recording discussing Acme Co. business matters.",
    },
    {
      id: "rec_2",
      title: "Acme Co.",
      createdBy: "Harold",
      createdAt: "2025-02-28T11:30:00Z",
      duration: "02:25",
      audioUrl:
        "data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA/+M4wAAAAAAAAAAAAEluZm8AAAAPAAAAAwAAAbAAuLi4uLi4uLi4uLi4uLi4uLi4uLi44ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg//////////////////////////////////////////////////////////////////8AAAAATGF2YzU4LjEzAAAAAAAAAAAAAAAAJAX/////////////////////////////////////////",
      transcription: "This is a mock transcription for the second recording.",
      summary: "Summary of the second recording discussing Acme Co. project updates.",
    },
    {
      id: "rec_3",
      title: "Acme Co.",
      createdBy: "Harold",
      createdAt: "2025-02-28T14:15:00Z",
      duration: "02:20",
      audioUrl:
        "data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA/+M4wAAAAAAAAAAAAEluZm8AAAAPAAAAAwAAAbAAuLi4uLi4uLi4uLi4uLi4uLi4uLi44ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg//////////////////////////////////////////////////////////////////8AAAAATGF2YzU4LjEzAAAAAAAAAAAAAAAAJAX/////////////////////////////////////////",
      transcription: "This is a mock transcription for the third recording.",
      summary: "Summary of the third recording discussing Acme Co. financial reports.",
    },
    {
      id: "rec_4",
      title: "Acme Co.",
      createdBy: "Harold",
      createdAt: "2025-02-28T16:45:00Z",
      duration: "02:20",
      audioUrl:
        "data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA/+M4wAAAAAAAAAAAAEluZm8AAAAPAAAAAwAAAbAAuLi4uLi4uLi4uLi4uLi4uLi4uLi44ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg//////////////////////////////////////////////////////////////////8AAAAATGF2YzU4LjEzAAAAAAAAAAAAAAAAJAX/////////////////////////////////////////",
      transcription: "This is a mock transcription for the fourth recording.",
      summary: "Summary of the fourth recording discussing Acme Co. client feedback.",
    },
    {
      id: "rec_5",
      title: "Acme Co.",
      createdBy: "Harold",
      createdAt: "2025-02-28T17:30:00Z",
      duration: "02:35",
      audioUrl:
        "data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA/+M4wAAAAAAAAAAAAEluZm8AAAAPAAAAAwAAAbAAuLi4uLi4uLi4uLi4uLi4uLi4uLi44ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg//////////////////////////////////////////////////////////////////8AAAAATGF2YzU4LjEzAAAAAAAAAAAAAAAAJAX/////////////////////////////////////////",
      transcription: "This is a mock transcription for the fifth recording.",
      summary: "Summary of the fifth recording discussing Acme Co. marketing strategy.",
    },
  ]

  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  return mockRecordings
}

/**
 * Record voice and upload
 */
export async function recordVoice(audioBlob: Blob): Promise<VoiceRecording> {
  // In a real app, this would upload the audio file to a server
  // This is a mock implementation for demonstration

  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1500))

  // Use a data URI for a silent audio file that's guaranteed to work
  const audioUrl =
    "data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA/+M4wAAAAAAAAAAAAEluZm8AAAAPAAAAAwAAAbAAuLi4uLi4uLi4uLi4uLi4uLi4uLi44ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg//////////////////////////////////////////////////////////////////8AAAAATGF2YzU4LjEzAAAAAAAAAAAAAAAAJAX/////////////////////////////////////////"

  // Return mock recording
  return {
    id: `rec_${Date.now()}`,
    title: "Acme Co.",
    createdBy: "Harold",
    createdAt: new Date().toISOString(),
    duration: "00:30", // Mock duration
    audioUrl,
    transcription: "This is an automatically generated transcription of your recording.",
    summary: "This is an automatically generated summary of your recording.",
  }
}

/**
 * Transcribe a recording
 */
export async function transcribeRecording(
  recordingId: string,
  options?: { language?: string },
): Promise<{ transcription: string; summary: string }> {
  // In a real app, this would call an API endpoint
  // This is a mock implementation for demonstration

  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 2000))

  // Return mock transcription and summary
  return {
    transcription: "This is a mock transcription generated for recording " + recordingId,
    summary: "This is a mock summary generated for recording " + recordingId,
  }
}

/**
 * Download recording summary
 */
export async function downloadSummary(recordingId: string): Promise<void> {
  // In a real app, this would generate and download a file
  // This is a mock implementation for demonstration

  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Create a mock text file and trigger download
  const text = "This is a mock summary for recording " + recordingId
  const blob = new Blob([text], { type: "text/plain" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = `summary_${recordingId}.txt`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

/**
 * Delete a recording
 */
export async function deleteRecording(recordingId: string): Promise<void> {
  // In a real app, this would call an API endpoint
  // This is a mock implementation for demonstration

  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 800))

  // In a real implementation, this would delete the recording from the server
  console.log(`Deleted recording: ${recordingId}`)
}

"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useRouter } from "next/navigation"
import { Save, Send } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface QAItem {
  id: string
  question: string
  answer: string
  client: string
  date: string
  status: "pending" | "answered"
  likes: number
}

// Mock data for a single Q&A item
const MOCK_QA_ITEM: QAItem = {
  id: "1",
  question:
    "Lorem ipsum is placeholder text commonly used in the graphic, print, and publishing industries for previewing layouts and visual mockups.",
  answer:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
  client: "Anonymous",
  date: "2025-05-15",
  status: "answered",
  likes: 12,
}

export default function QAAnswerForm({
  questionId,
  isEditing = false,
}: {
  questionId: string
  isEditing?: boolean
}) {
  const router = useRouter()
  const [qaItem, setQaItem] = useState<QAItem | null>(null)
  const [answer, setAnswer] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // In a real app, fetch the question data from API
    // For now, we'll use mock data
    const fetchQuestion = async () => {
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 500))

        // Use mock data
        setQaItem({
          ...MOCK_QA_ITEM,
          id: questionId,
        })

        if (isEditing) {
          setAnswer(MOCK_QA_ITEM.answer)
        }
      } catch (err) {
        setError("Failed to load question data")
        console.error(err)
      }
    }

    fetchQuestion()
  }, [questionId, isEditing])

  const handleSubmit = async () => {
    if (!answer.trim()) {
      setError("Answer cannot be empty")
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      // In a real app, save to API
      // For now, just simulate a delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Navigate back to Q&A list after saving
      router.push("/qa")
    } catch (err) {
      setError("Failed to save answer")
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!qaItem) {
    return <div className="text-center py-8">Loading question...</div>
  }

  return (
    <div className="space-y-6">
      <div className="border rounded-md p-4 bg-gray-50">
        <div className="text-sm text-gray-500 mb-2">
          {qaItem.client} • {new Date(qaItem.date).toLocaleDateString()}
        </div>
        <p className="font-medium">{qaItem.question}</p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-4">
        <Textarea
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Write your answer here..."
          className="min-h-[200px]"
        />

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => router.push("/qa")} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting} className="flex items-center gap-2">
            {isEditing ? (
              <>
                <Save size={16} />
                Save Changes
              </>
            ) : (
              <>
                <Send size={16} />
                Submit Answer
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}

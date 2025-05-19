"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { useRouter } from "next/navigation"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function QANewForm() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    question: "",
    clientName: "",
    isAnonymous: true,
    category: "general",
    tags: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async () => {
    if (!formData.question.trim()) {
      setError("Question cannot be empty")
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
      setError("Failed to save question")
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="question">Question</Label>
          <Textarea
            id="question"
            value={formData.question}
            onChange={(e) => handleChange("question", e.target.value)}
            placeholder="Enter the legal question..."
            className="min-h-[150px]"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="clientName">Client Name</Label>
            <Input
              id="clientName"
              value={formData.clientName}
              onChange={(e) => handleChange("clientName", e.target.value)}
              placeholder="Enter client name"
              disabled={formData.isAnonymous}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={formData.category} onValueChange={(value) => handleChange("category", value)}>
              <SelectTrigger id="category">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="general">General</SelectItem>
                <SelectItem value="family-law">Family Law</SelectItem>
                <SelectItem value="criminal-law">Criminal Law</SelectItem>
                <SelectItem value="corporate-law">Corporate Law</SelectItem>
                <SelectItem value="real-estate">Real Estate</SelectItem>
                <SelectItem value="intellectual-property">Intellectual Property</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="tags">Tags (comma separated)</Label>
          <Input
            id="tags"
            value={formData.tags}
            onChange={(e) => handleChange("tags", e.target.value)}
            placeholder="e.g. divorce, custody, property"
          />
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="isAnonymous"
            checked={formData.isAnonymous}
            onCheckedChange={(checked) => handleChange("isAnonymous", checked === true)}
          />
          <Label htmlFor="isAnonymous">Submit as anonymous</Label>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={() => router.push("/qa")} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            Submit Question
          </Button>
        </div>
      </div>
    </div>
  )
}

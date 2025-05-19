"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Video, FileText, Download, ExternalLink } from "lucide-react"
import { formatDate } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface VideoConsultation {
  id: string
  clientName: string
  scheduledTime: string
  status: "pending" | "rejected" | "approved"
  transcriptAccess: string
  videoLink?: string
  hasTranscript?: boolean
}

interface VideoConsultationTableProps {
  initialConsultations: VideoConsultation[]
}

export default function VideoConsultationTable({ initialConsultations }: VideoConsultationTableProps) {
  const [consultations] = useState<VideoConsultation[]>(initialConsultations)
  const [selectedConsultation, setSelectedConsultation] = useState<VideoConsultation | null>(null)
  const { toast } = useToast()

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-600 border-yellow-200">
            Pending
          </Badge>
        )
      case "rejected":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200">
            Rejected
          </Badge>
        )
      case "approved":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
            Approved
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const handleStartCall = (consultation: VideoConsultation) => {
    if (consultation.videoLink) {
      // Open the video link in a new tab
      window.open(consultation.videoLink, "_blank")
    } else {
      toast({
        title: "Starting call",
        description: `Starting video call for consultation ${consultation.id}`,
      })
    }
  }

  const handleReschedule = (consultationId: string) => {
    toast({
      title: "Reschedule",
      description: `Opening reschedule dialog for consultation ${consultationId}`,
    })
  }

  const handleViewTranscript = (consultation: VideoConsultation) => {
    setSelectedConsultation(consultation)
  }

  const handleDownloadTranscript = (type: "original" | "summary") => {
    if (!selectedConsultation) return

    toast({
      title: "Downloading transcript",
      description: `Downloading ${type} transcript for consultation with ${selectedConsultation.clientName}`,
    })

    // In a real app, this would trigger an actual download
    const text =
      type === "original"
        ? `Original transcript for consultation with ${selectedConsultation.clientName} on ${formatDate(selectedConsultation.scheduledTime, true)}`
        : `Summary transcript for consultation with ${selectedConsultation.clientName} on ${formatDate(selectedConsultation.scheduledTime, true)}`

    const blob = new Blob([text], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${type}-transcript-${selectedConsultation.id}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleGenerateTranscript = (consultationId: string) => {
    toast({
      title: "Generating transcript",
      description: "Automatically generating transcript from video consultation recording",
    })
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Client Name</TableHead>
              <TableHead>Scheduled Time</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Transcript Access</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {consultations.map((consultation) => (
              <TableRow key={consultation.id}>
                <TableCell>{consultation.clientName}</TableCell>
                <TableCell>{formatDate(consultation.scheduledTime, true)}</TableCell>
                <TableCell>{getStatusBadge(consultation.status)}</TableCell>
                <TableCell>{consultation.transcriptAccess}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      className="bg-green-600 hover:bg-green-700 text-white"
                      onClick={() => handleStartCall(consultation)}
                    >
                      {consultation.videoLink ? (
                        <>
                          <ExternalLink className="h-4 w-4 mr-1" />
                          Join Call
                        </>
                      ) : (
                        <>
                          <Video className="h-4 w-4 mr-1" />
                          Start Call
                        </>
                      )}
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleReschedule(consultation.id)}>
                      Reschedule
                    </Button>
                    {consultation.hasTranscript ? (
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                            onClick={() => handleViewTranscript(consultation)}
                          >
                            <FileText className="h-4 w-4 mr-1" />
                            Transcript
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[625px]">
                          <DialogHeader>
                            <DialogTitle>Video Consultation Transcript</DialogTitle>
                            <DialogDescription>
                              Consultation with {consultation.clientName} on{" "}
                              {formatDate(consultation.scheduledTime, true)}
                            </DialogDescription>
                          </DialogHeader>
                          <Tabs defaultValue="original" className="mt-4">
                            <TabsList className="grid w-full grid-cols-2">
                              <TabsTrigger value="original">Original Transcript</TabsTrigger>
                              <TabsTrigger value="summary">Summary</TabsTrigger>
                            </TabsList>
                            <TabsContent value="original" className="mt-4">
                              <div className="border rounded-md p-4 h-[300px] overflow-y-auto bg-gray-50">
                                <p className="text-sm">
                                  <strong>Lawyer:</strong> Good morning, thank you for joining this consultation.
                                </p>
                                <p className="text-sm mt-2">
                                  <strong>Client:</strong> Good morning, thank you for making the time.
                                </p>
                                <p className="text-sm mt-2">
                                  <strong>Lawyer:</strong> Let's discuss the details of your case. Could you please
                                  provide an overview of the situation?
                                </p>
                                <p className="text-sm mt-2">
                                  <strong>Client:</strong> Of course. The issue began approximately three months ago
                                  when...
                                </p>
                                {/* More transcript content would go here */}
                              </div>
                              <div className="flex justify-end mt-4">
                                <Button onClick={() => handleDownloadTranscript("original")}>
                                  <Download className="h-4 w-4 mr-1" />
                                  Download Original
                                </Button>
                              </div>
                            </TabsContent>
                            <TabsContent value="summary" className="mt-4">
                              <div className="border rounded-md p-4 h-[300px] overflow-y-auto bg-gray-50">
                                <h3 className="font-medium mb-2">Consultation Summary</h3>
                                <p className="text-sm mb-2">
                                  This consultation covered the client's legal issue that began three months ago. The
                                  main points discussed were:
                                </p>
                                <ul className="list-disc pl-5 space-y-1 text-sm">
                                  <li>Background of the case and relevant timeline</li>
                                  <li>Legal options available to the client</li>
                                  <li>Potential outcomes and associated risks</li>
                                  <li>Next steps and documentation requirements</li>
                                </ul>
                                <h3 className="font-medium mt-4 mb-2">Action Items</h3>
                                <ol className="list-decimal pl-5 space-y-1 text-sm">
                                  <li>Client to provide additional documentation by next week</li>
                                  <li>Lawyer to draft initial response letter</li>
                                  <li>Follow-up consultation scheduled for next month</li>
                                </ol>
                              </div>
                              <div className="flex justify-end mt-4">
                                <Button onClick={() => handleDownloadTranscript("summary")}>
                                  <Download className="h-4 w-4 mr-1" />
                                  Download Summary
                                </Button>
                              </div>
                            </TabsContent>
                          </Tabs>
                        </DialogContent>
                      </Dialog>
                    ) : (
                      <Button size="sm" variant="outline" onClick={() => handleGenerateTranscript(consultation.id)}>
                        <FileText className="h-4 w-4 mr-1" />
                        Generate Transcript
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  )
}

"use client"

import type React from "react"
import type { Case, CaseStatus } from "@/types/case"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Eye, FileText } from "lucide-react"
import { formatDate } from "@/lib/utils"
import { getCases, updateCaseStatus } from "@/lib/api/cases-api"
import { useToast } from "@/hooks/use-toast"

interface CasesTableProps {
  initialCases: Case[]
}

export default function CasesTable({ initialCases }: CasesTableProps) {
  const [cases, setCases] = useState<Case[]>(initialCases)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<CaseStatus | "all">("all")
  const [isLoading, setIsLoading] = useState(false)

  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()

  // Load cases with filters
  useEffect(() => {
    const fetchCases = async () => {
      setIsLoading(true)
      try {
        const status = (searchParams.get("status") as CaseStatus) || "all"
        setStatusFilter(status)

        const query = searchParams.get("query") || ""
        setSearchQuery(query)

        const fetchedCases = await getCases({ status, query })
        setCases(fetchedCases)
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load cases",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchCases()
  }, [searchParams, toast])

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams(searchParams)

    if (searchQuery) {
      params.set("query", searchQuery)
    } else {
      params.delete("query")
    }

    router.push(`/cases?${params.toString()}`)
  }

  // Handle status filter change
  const handleStatusChange = (value: string) => {
    const status = value as CaseStatus | "all"
    setStatusFilter(status)

    const params = new URLSearchParams(searchParams)

    if (status !== "all") {
      params.set("status", status)
    } else {
      params.delete("status")
    }

    router.push(`/cases?${params.toString()}`)
  }

  // Handle case status update
  const handleStatusUpdate = async (caseId: string, newStatus: CaseStatus) => {
    try {
      await updateCaseStatus(caseId, newStatus)

      // Update local state
      setCases(cases.map((c) => (c.id === caseId ? { ...c, status: newStatus } : c)))

      toast({
        title: "Status updated",
        description: `Case ${caseId} has been ${newStatus}`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update case status",
        variant: "destructive",
      })
    }
  }

  // View case details
  const viewCaseDetails = (caseId: string) => {
    router.push(`/cases/${caseId}`)
  }

  // Get status badge
  const getStatusBadge = (status: CaseStatus) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-600 border-yellow-200">
            Pending
          </Badge>
        )
      case "approved":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
            Approved
          </Badge>
        )
      case "rejected":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200">
            Rejected
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <form onSubmit={handleSearch} className="flex w-full max-w-sm items-center space-x-2">
          <Input
            type="search"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
          <Button type="submit" variant="outline" size="icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
          </Button>
        </form>

        <Select value={statusFilter} onValueChange={handleStatusChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Case ID</TableHead>
              <TableHead>Client Name</TableHead>
              <TableHead>Case Title</TableHead>
              <TableHead>Recent Update</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cases.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  {isLoading ? "Loading cases..." : "No cases found"}
                </TableCell>
              </TableRow>
            ) : (
              cases.map((caseItem) => (
                <TableRow key={caseItem.id}>
                  <TableCell>{caseItem.id}</TableCell>
                  <TableCell>{caseItem.clientName}</TableCell>
                  <TableCell>{caseItem.title}</TableCell>
                  <TableCell>{formatDate(caseItem.updatedAt)}</TableCell>
                  <TableCell>{getStatusBadge(caseItem.status)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => viewCaseDetails(caseItem.id)}
                        title="View Case"
                      >
                        <Eye size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => router.push(`/cases/${caseItem.id}/files`)}
                        title="View Files"
                      >
                        <FileText size={16} />
                      </Button>
                      {caseItem.status === "pending" && (
                        <>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleStatusUpdate(caseItem.id, "approved")}
                            className="text-green-600"
                            title="Approve Case"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M20 6 9 17l-5-5" />
                            </svg>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleStatusUpdate(caseItem.id, "rejected")}
                            className="text-red-600"
                            title="Reject Case"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M18 6 6 18" />
                              <path d="m6 6 12 12" />
                            </svg>
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

"use client"

import type React from "react"
import type { Client, ClientStatus } from "@/types/client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Star, Ban, MessageSquare } from "lucide-react"
import { formatDate } from "@/lib/utils"
import { getClients, updateClientStatus, toggleFavorite, toggleBlocked } from "@/lib/api/clients-api"
import { useToast } from "@/hooks/use-toast"

interface ClientsTableProps {
  initialClients: Client[]
}

export default function ClientsTable({ initialClients }: ClientsTableProps) {
  const [clients, setClients] = useState<Client[]>(initialClients)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<ClientStatus | "all">("active")
  const [isLoading, setIsLoading] = useState(false)

  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()

  // Load clients with filters
  useEffect(() => {
    const fetchClients = async () => {
      setIsLoading(true)
      try {
        const status = (searchParams.get("status") as ClientStatus) || "active"
        setStatusFilter(status)

        const query = searchParams.get("query") || ""
        setSearchQuery(query)

        const fetchedClients = await getClients({ status, query })
        setClients(fetchedClients)
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load clients",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchClients()
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

    router.push(`/client?${params.toString()}`)
  }

  // Handle status filter change
  const handleStatusChange = (value: string) => {
    const status = value as ClientStatus | "all"
    setStatusFilter(status)

    const params = new URLSearchParams(searchParams)

    if (status !== "all") {
      params.set("status", status)
    } else {
      params.delete("status")
    }

    router.push(`/client?${params.toString()}`)
  }

  // Handle client status update
  const handleStatusUpdate = async (clientId: string, newStatus: ClientStatus) => {
    try {
      await updateClientStatus(clientId, newStatus)

      // Update local state
      setClients(clients.map((c) => (c.id === clientId ? { ...c, status: newStatus } : c)))

      toast({
        title: "Status updated",
        description: `Client status has been updated to ${newStatus}`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update client status",
        variant: "destructive",
      })
    }
  }

  // Toggle favorite status
  const handleToggleFavorite = async (clientId: string) => {
    try {
      const client = clients.find((c) => c.id === clientId)
      if (!client) return

      const updatedClient = await toggleFavorite(clientId, !client.isFavorite)

      // Update local state
      setClients(clients.map((c) => (c.id === clientId ? updatedClient : c)))

      toast({
        title: updatedClient.isFavorite ? "Added to favorites" : "Removed from favorites",
        description: `${updatedClient.name} has been ${
          updatedClient.isFavorite ? "added to" : "removed from"
        } favorites`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update favorite status",
        variant: "destructive",
      })
    }
  }

  // Toggle blocked status
  const handleToggleBlocked = async (clientId: string) => {
    try {
      const client = clients.find((c) => c.id === clientId)
      if (!client) return

      const updatedClient = await toggleBlocked(clientId, !client.isBlocked)

      // Update local state
      setClients(clients.map((c) => (c.id === clientId ? updatedClient : c)))

      toast({
        title: updatedClient.isBlocked ? "Client blocked" : "Client unblocked",
        description: `${updatedClient.name} has been ${updatedClient.isBlocked ? "blocked" : "unblocked"}`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update blocked status",
        variant: "destructive",
      })
    }
  }

  // View client details
  const viewClientDetails = (clientId: string) => {
    router.push(`/client/${clientId}`)
  }

  // Get status badge
  const getStatusBadge = (status: ClientStatus) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-600 border-yellow-200">
            Pending
          </Badge>
        )
      case "active":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
            Approved
          </Badge>
        )
      case "inactive":
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
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Client Name</TableHead>
              <TableHead>Case ID</TableHead>
              <TableHead>Contact Info</TableHead>
              <TableHead>Last Contact Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clients.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  {isLoading ? "Loading clients..." : "No clients found"}
                </TableCell>
              </TableRow>
            ) : (
              clients.map((client) => (
                <TableRow key={client.id}>
                  <TableCell>{client.name}</TableCell>
                  <TableCell>{client.caseId}</TableCell>
                  <TableCell>{client.contactInfo}</TableCell>
                  <TableCell>{formatDate(client.lastContactDate)}</TableCell>
                  <TableCell>{getStatusBadge(client.status)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleToggleFavorite(client.id)}
                        className={client.isFavorite ? "text-yellow-500" : "text-gray-500"}
                        title={client.isFavorite ? "Remove from Favorites" : "Add to Favorites"}
                      >
                        <Star size={16} className={client.isFavorite ? "fill-yellow-500" : ""} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => router.push(`/chat?clientId=${client.id}`)}
                        title="Send Message"
                      >
                        <MessageSquare size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleToggleBlocked(client.id)}
                        className={client.isBlocked ? "text-red-500" : "text-gray-500"}
                        title={client.isBlocked ? "Unblock Client" : "Block Client"}
                      >
                        <Ban size={16} />
                      </Button>
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

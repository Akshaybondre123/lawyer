"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import {
  Search,
  MessageSquare,
  MoreHorizontal,
  Phone,
  Video,
} from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
} from "@/components/ui/form"
import { Badge } from "@/components/ui/badge"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { formatDate } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"

const searchFormSchema = z.object({
  query: z.string(),
})

type SearchFormData = z.infer<typeof searchFormSchema>

interface Chat {
  id: string
  clientName: string
  lastMessage: string
  timestamp: string
  unreadCount: number
  status: "online" | "offline" | "away"
  avatar?: string
}

interface ChatListProps {
  initialChats?: Chat[]
  onChatSelect?: (chatId: string) => void
}

// Mock data
const mockChats: Chat[] = [
  {
    id: "1",
    clientName: "John Smith",
    lastMessage: "Thank you for your help with the contract review.",
    timestamp: new Date().toISOString(),
    unreadCount: 2,
    status: "online",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: "2",
    clientName: "Sarah Johnson",
    lastMessage: "When can we schedule the next consultation?",
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    unreadCount: 0,
    status: "away",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: "3",
    clientName: "Michael Brown",
    lastMessage: "I've sent the documents you requested.",
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    unreadCount: 1,
    status: "offline",
    avatar: "/placeholder.svg?height=32&width=32",
  },
]

export default function ChatList({ initialChats = mockChats, onChatSelect }: ChatListProps) {
  const [chats, setChats] = useState<Chat[]>(initialChats)
  const [filteredChats, setFilteredChats] = useState<Chat[]>(initialChats)
  const { toast } = useToast()

  const searchForm = useForm<SearchFormData>({
    resolver: zodResolver(searchFormSchema),
    defaultValues: {
      query: "",
    },
  })

  const watchedQuery = searchForm.watch("query")

  // Filter chats on search
  useEffect(() => {
    if (!watchedQuery.trim()) {
      setFilteredChats(chats)
    } else {
      const filtered = chats.filter(
        (chat) =>
          chat.clientName.toLowerCase().includes(watchedQuery.toLowerCase()) ||
          chat.lastMessage.toLowerCase().includes(watchedQuery.toLowerCase())
      )
      setFilteredChats(filtered)
    }
  }, [watchedQuery, chats])

  // Warn about missing chat IDs
  useEffect(() => {
    chats.forEach((chat, index) => {
      if (!chat.id) {
        console.warn(`Chat at index ${index} is missing an id.`)
      }
    })
  }, [chats])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "online":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
            Online
          </Badge>
        )
      case "away":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-600 border-yellow-200">
            Away
          </Badge>
        )
      case "offline":
        return (
          <Badge variant="outline" className="bg-gray-50 text-gray-600 border-gray-200">
            Offline
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const handleChatAction = (action: string, chatId: string) => {
    switch (action) {
      case "message":
        onChatSelect?.(chatId)
        break
      case "call":
        toast({
          title: "Starting call",
          description: `Initiating voice call for chat ${chatId}`,
        })
        break
      case "video":
        toast({
          title: "Starting video call",
          description: `Initiating video call for chat ${chatId}`,
        })
        break
    }
  }

  const formatTimestamp = (timestamp: string) => {
    try {
      return formatDate(timestamp, true)
    } catch {
      return "Invalid date"
    }
  }

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Form {...searchForm}>
          <FormField
            control={searchForm.control}
            name="query"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <Input
                      placeholder="Search conversations..."
                      {...field}
                      className="bg-[#F5F5F5] border-gray-200 pl-10"
                    />
                  </div>
                </FormControl>
              </FormItem>
            )}
          />
        </Form>
      </div>

      {/* Chat Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Client</TableHead>
              <TableHead>Last Message</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Unread</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredChats.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                  No conversations found
                </TableCell>
              </TableRow>
            ) : (
              filteredChats.map((chat, index) => {
                const rowKey = chat.id?.toString() || `chat-${index}`
                return (
                  <TableRow key={rowKey} className={index % 2 === 0 ? "bg-gray-100" : ""}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage
                            src={chat.avatar || "/placeholder.svg?height=32&width=32"}
                            alt={chat.clientName}
                          />
                          <AvatarFallback>{chat.clientName[0]}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{chat.clientName}</span>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-xs truncate">{chat.lastMessage}</TableCell>
                    <TableCell>{formatTimestamp(chat.timestamp)}</TableCell>
                    <TableCell>{getStatusBadge(chat.status)}</TableCell>
                    <TableCell>
                      {chat.unreadCount > 0 && (
                        <Badge variant="destructive" className="rounded-full">
                          {chat.unreadCount}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline" onClick={() => handleChatAction("message", chat.id)}>
                          <MessageSquare className="h-4 w-4 mr-1" />
                          Chat
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem onClick={() => handleChatAction("call", chat.id)}>
                              <Phone className="h-4 w-4 mr-2" />
                              Voice Call
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleChatAction("video", chat.id)}>
                              <Video className="h-4 w-4 mr-2" />
                              Video Call
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

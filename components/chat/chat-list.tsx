"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MessageSquare } from "lucide-react"
import { formatDate } from "@/lib/utils"
import { getChats } from "@/lib/api/chat-api"
import { useToast } from "@/hooks/use-toast"
import { ChatPopup } from "@/components/chat/chat-popup"
import type { ChatSummary } from "@/types/chat"
import { Badge } from "@/components/ui/badge"

interface ChatListProps {
  initialChats: ChatSummary[]
}

export default function ChatList({ initialChats }: ChatListProps) {
  // Use initialChats directly without state to avoid initial re-renders
  const [chats, setChats] = useState<ChatSummary[]>(initialChats)
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [activeChatClientId, setActiveChatClientId] = useState<string | null>(null)
  const [isChatOpen, setIsChatOpen] = useState(false)

  const router = useRouter()
  const { toast } = useToast()

  // Handle search form submission
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()

    // Update URL
    const params = new URLSearchParams()
    if (inputValue) {
      params.set("query", inputValue)
    }
    router.push(`/chat?${params.toString()}`)

    // Fetch chats directly on search
    await fetchChats(inputValue)
  }

  // Separate function to fetch chats
  const fetchChats = async (query: string) => {
    setIsLoading(true)
    try {
      const fetchedChats = await getChats({ query })
      setChats(fetchedChats)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load chats",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Open chat with client
  const handleOpenChat = (clientId: string) => {
    setActiveChatClientId(clientId)
    setIsChatOpen(true)
  }

  const handleCloseChat = () => {
    setIsChatOpen(false)
    setActiveChatClientId(null)
  }

  return (
    <>
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <form onSubmit={handleSearch} className="flex w-full max-w-sm items-center space-x-2">
            <Input
              type="search"
              placeholder="Search"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
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
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Client Name</TableHead>
                <TableHead>Last Message</TableHead>
                <TableHead>Token Usage</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {chats.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                    {isLoading ? "Loading chats..." : "No chats found"}
                  </TableCell>
                </TableRow>
              ) : (
                chats.map((chat) => (
                  <TableRow key={chat.clientId}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage
                            src={chat.clientAvatar || "/placeholder.svg?height=32&width=32"}
                            alt={chat.clientName}
                          />
                          <AvatarFallback>{chat.clientName[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span>{chat.clientName}</span>
                          {chat.unreadCount > 0 && (
                            <Badge variant="secondary" className="text-xs w-fit">
                              {chat.unreadCount} unread
                            </Badge>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="text-sm truncate max-w-[200px]">{chat.lastMessagePreview}</span>
                        <span className="text-xs text-gray-500">{formatDate(chat.lastMessageTime)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">
                        {chat.tokenUsage} tokens
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenChat(chat.clientId)}
                        className="flex items-center gap-1"
                      >
                        <MessageSquare size={16} />
                        Chat
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {isChatOpen && activeChatClientId && (
        <div className="chat-popup-container">
          <ChatPopup onClose={handleCloseChat} clientId={activeChatClientId} />
        </div>
      )}
    </>
  )
}

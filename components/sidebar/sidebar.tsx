"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  LayoutDashboard,
  FileText,
  Users,
  Bot,
  MessageSquare,
  Video,
  VoicemailIcon as VoiceIcon,
  TrendingUp,
  BookOpen,
  HelpCircle,
  Coins,
  CreditCard,
  Settings,
  ChevronDown,
} from "lucide-react"

interface NavItemProps {
  href: string
  icon: React.ReactNode
  label: string
  isActive: boolean
}

function NavItem({ href, icon, label, isActive }: NavItemProps) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
        isActive ? "bg-gray-100 text-gray-900" : "text-gray-500 hover:text-gray-900 hover:bg-gray-100",
      )}
    >
      {icon}
      <span>{label}</span>
    </Link>
  )
}

export default function Sidebar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(true)

  const navItems = [
    { href: "/dashboard", icon: <LayoutDashboard size={18} />, label: "Dashboard" },
    { href: "/cases", icon: <FileText size={18} />, label: "Cases" },
    { href: "/client", icon: <Users size={18} />, label: "Client" },
    { href: "/ai-assistants", icon: <Bot size={18} />, label: "AI Assistants" },
    { href: "/chat", icon: <MessageSquare size={18} />, label: "Chat" },
    { href: "/video-consultations", icon: <Video size={18} />, label: "Video Consultations" },
    { href: "/voice-summary", icon: <VoiceIcon size={18} />, label: "Voice Summary" },
    { href: "/ai-marketing", icon: <TrendingUp size={18} />, label: "AI-Marketing" },
    { href: "/blog", icon: <BookOpen size={18} />, label: "Blog" },
    { href: "/qa", icon: <HelpCircle size={18} />, label: "Q&A" },
    { href: "/token", icon: <Coins size={18} />, label: "Token" },
    { href: "/subscription", icon: <CreditCard size={18} />, label: "Subscription" },
    { href: "/settings", icon: <Settings size={18} />, label: "Settings" },
  ]

  return (
    <aside className="w-64 border-r border-gray-200 bg-white">
      <div className="flex flex-col h-full">
        <div className="p-4 border-b">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
              <AvatarFallback>J</AvatarFallback>
            </Avatar>
            <div className="flex items-center justify-between flex-1">
              <span className="font-medium">Joseph</span>
              <button onClick={() => setIsOpen(!isOpen)}>
                <ChevronDown size={16} className={cn("transition-transform", isOpen ? "rotate-180" : "")} />
              </button>
            </div>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <NavItem
              key={item.href}
              href={item.href}
              icon={item.icon}
              label={item.label}
              isActive={pathname === item.href}
            />
          ))}
        </nav>
      </div>
    </aside>
  )
}

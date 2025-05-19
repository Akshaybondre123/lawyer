import type { Metadata } from 'next'
import './globals.css'
import { ChatButton } from "@/components/chat/chat-button"

export const metadata: Metadata = {
  // You can fill in the title and description as needed
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        {children}
        <ChatButton />
      </body>
    </html>
  )
}

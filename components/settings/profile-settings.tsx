"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { PencilIcon } from "lucide-react"

export default function ProfileSettings() {
  const [profileImage, setProfileImage] = useState<string>("/placeholder.svg?height=100&width=100")

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h3 className="text-xl font-semibold">Profile Details</h3>
        <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50 sm:w-auto w-full">
          Log Out
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <Avatar className="h-24 w-24">
              <AvatarImage src={profileImage || "/placeholder.svg"} alt="Profile" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <Button size="icon" className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-black hover:bg-gray-800">
              <PencilIcon className="h-4 w-4" />
              <span className="sr-only">Change avatar</span>
            </Button>
          </div>
          <div className="text-center">
            <h4 className="font-medium">John Doe</h4>
            <p className="text-sm text-gray-500">johndoe123@gmail.com</p>
          </div>
        </div>

        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name</Label>
            <Input id="firstName" placeholder="Enter first name" defaultValue="John" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input id="lastName" placeholder="Enter last name" defaultValue="Doe" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="Enter email" defaultValue="johndoe123@gmail.com" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" placeholder="Enter phone number" defaultValue="(555) 123-4567" />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              placeholder="Write a short bio..."
              className="min-h-[100px]"
              defaultValue="Experienced attorney specializing in corporate law with over 10 years of practice."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="practiceArea">Practice Area</Label>
            <Select defaultValue="corporate">
              <SelectTrigger id="practiceArea">
                <SelectValue placeholder="Select practice area" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="corporate">Corporate Law</SelectItem>
                <SelectItem value="family">Family Law</SelectItem>
                <SelectItem value="criminal">Criminal Law</SelectItem>
                <SelectItem value="immigration">Immigration Law</SelectItem>
                <SelectItem value="intellectual">Intellectual Property</SelectItem>
                <SelectItem value="real-estate">Real Estate Law</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="experience">Years of Experience</Label>
            <Select defaultValue="10">
              <SelectTrigger id="experience">
                <SelectValue placeholder="Select years" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1-2 years</SelectItem>
                <SelectItem value="3">3-5 years</SelectItem>
                <SelectItem value="6">6-9 years</SelectItem>
                <SelectItem value="10">10+ years</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:justify-end mt-6 gap-4">
        <Button variant="outline" className="w-full sm:w-auto">
          Cancel
        </Button>
        <Button className="bg-black hover:bg-gray-800 text-white w-full sm:w-auto">Save Changes</Button>
      </div>
    </div>
  )
}

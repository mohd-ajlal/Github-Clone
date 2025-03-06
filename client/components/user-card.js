"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, MapPin, Building } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useAuth } from "@/context/auth-context"

export default function UserCard({ user }) {
  const { isAuthenticated } = useAuth()

  if (!user) return null

  // Handle different API response formats
  const username = user.login || user.username || ""
  const name = user.name || username
  const avatarUrl = user.avatar_url || user.avatarUrl || "/placeholder.svg?height=80&width=80"
  const bio = user.bio || "No bio provided"
  const location = user.location || ""
  const company = user.company || ""
  const followers = user.followers || 0
  const following = user.following || 0

  return (
    <Card className="overflow-hidden h-full">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full overflow-hidden">
            <Image src={avatarUrl || "/placeholder.svg"} alt={username} width={64} height={64} />
          </div>
          <div>
            <CardTitle className="text-lg">
              <Link href={`/users/${username}`} className="hover:underline">
                {name}
              </Link>
            </CardTitle>
            <CardDescription>@{username}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 line-clamp-2">{bio}</p>
        <div className="space-y-2 text-sm">
          {location && (
            <div className="flex items-center text-gray-500 dark:text-gray-400">
              <MapPin className="mr-2 h-4 w-4" />
              <span>{location}</span>
            </div>
          )}
          {company && (
            <div className="flex items-center text-gray-500 dark:text-gray-400">
              <Building className="mr-2 h-4 w-4" />
              <span>{company}</span>
            </div>
          )}
          <div className="flex items-center text-gray-500 dark:text-gray-400">
            <Users className="mr-2 h-4 w-4" />
            <span>
              <span className="font-medium">{followers}</span> followers ·{" "}
              <span className="font-medium">{following}</span> following
            </span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-2">
        {isAuthenticated && (
          <Button variant="outline" size="sm" className="w-full">
            Follow
          </Button>
        )}
        {!isAuthenticated && (
          <Button variant="outline" size="sm" className="w-full" asChild>
            <Link href={`/users/${username}`}>View Profile</Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}

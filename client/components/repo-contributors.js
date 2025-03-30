"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import LoadingSpinner from "@/components/loading-spinner"

export default function RepoContributors({ owner, repo, limit }) {
  const [contributors, setContributors] = useState([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchContributors()
  }, [owner, repo])

  const fetchContributors = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/repos/contributors/${owner}/${repo}`,
        { credentials: "include" },
      )

      if (!response.ok) {
        throw new Error("Failed to fetch contributors")
      }

      const data = await response.json()
      setContributors(limit ? data.contributors.slice(0, limit) : data.contributors)
    } catch (error) {
      console.error("Error fetching contributors:", error)
      toast({
        title: "Error",
        description: "Failed to load contributors. Please try again later.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-4 flex justify-center">
          <LoadingSpinner size="small" />
        </CardContent>
      </Card>
    )
  }

  if (!contributors || contributors.length === 0) {
    return (
      <Card>
        <CardContent className="p-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">No contributors found</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent className="p-4">
        <h3 className="font-medium mb-3">Contributors</h3>
        <div className="flex flex-wrap gap-2">
          {contributors.map((contributor) => (
            <Link
              key={contributor.id}
              href={`/users/${contributor.login}`}
              className="flex flex-col items-center text-center"
            >
              <Avatar className="h-10 w-10">
                <AvatarImage src={contributor.avatar_url || "/placeholder.svg"} alt={contributor.login} />
                <AvatarFallback>{contributor.login.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <span className="text-xs mt-1 max-w-[60px] truncate">{contributor.login}</span>
            </Link>
          ))}
        </div>
        {limit && contributors.length >= limit && (
          <Link
            href={`/repos/${owner}/${repo}/contributors`}
            className="text-xs text-blue-500 hover:underline mt-2 block"
          >
            View all contributors
          </Link>
        )}
      </CardContent>
    </Card>
  )
}

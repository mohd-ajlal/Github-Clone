"use client"

import { useState, useEffect } from "react"
import LoadingSpinner from "@/components/loading-spinner"
import { useToast } from "@/hooks/use-toast"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatDistanceToNow } from "date-fns" // Assuming date-fns is available for date formatting

const UserActivity = ({ username, limit }) => {
  const [activity, setActivity] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const { toast } = useToast()

  useEffect(() => {
    if (!username) return

    const fetchActivity = async () => {
      setLoading(true)
      setError(null)
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
        const response = await fetch(
          `${apiUrl}/api/users/activity?username=${username}${limit ? `&limit=${limit}` : ""}`,
          { credentials: "include" }
        )

        if (!response.ok) {
          throw new Error("Failed to fetch user activity")
        }

        const data = await response.json()
        setActivity(data.activity)
      } catch (err) {
        console.error("Error fetching user activity:", err)
        setError(err.message)
        toast({
          title: "Error",
          description: "Failed to load user activity.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchActivity()
  }, [username, limit, toast])

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <LoadingSpinner />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center text-red-500 py-8">
        Error: {error}
      </div>
    )
  }

  if (!activity || activity.length === 0) {
    return (
      <div className="text-center text-gray-500 dark:text-gray-400 py-8">
        No recent activity found for {username}.
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {activity.map((item, index) => (
  <Card key={item.id || index}>
    <CardContent className="p-4">
      <div className="flex items-center space-x-3">
        <div>
          <p className="text-sm font-medium">
            {item.type === 'PushEvent' && (
              <>
                Pushed to <span className="font-mono">{item.repo?.name ?? "unknown repo"}</span>
              </>
            )}
            {item.type === 'CreateEvent' && item.payload?.ref_type && (
              <>
                Created {item.payload.ref_type} <span className="font-mono">{item.payload.ref ?? "unknown"}</span> in <span className="font-mono">{item.repo?.name ?? "unknown repo"}</span>
              </>
            )}
            {item.type === 'PullRequestEvent' && item.payload?.action && (
              <>
                {item.payload.action} pull request <span className="font-mono">#{item.payload.number ?? "?"}</span> in <span className="font-mono">{item.repo?.name ?? "unknown repo"}</span>
              </>
            )}
            {item.type === 'IssuesEvent' && item.payload?.action && (
              <>
                {item.payload.action} issue <span className="font-mono">#{item.payload.issue?.number ?? "?"}</span> in <span className="font-mono">{item.repo?.name ?? "unknown repo"}</span>
              </>
            )}
            {!['PushEvent', 'CreateEvent', 'PullRequestEvent', 'IssuesEvent'].includes(item.type) && (
              <>
                Performed {item.type} in <span className="font-mono">{item.repo?.name ?? "unknown repo"}</span>
              </>
            )}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {formatDistanceToNow(new Date(item.created_at), { addSuffix: true })}
          </p>
        </div>
      </div>
    </CardContent>
  </Card>
))}

    </div>
  )
}

export default UserActivity

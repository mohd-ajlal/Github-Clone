import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, CheckCircle2, GitPullRequest } from "lucide-react"
import Link from "next/link"

export default function IssueSearchResult({ issue }) {
  if (!issue) return null

  const title = issue.title || ""
  const number = issue.number || 0
  const state = issue.state || "open"
  const isPR = issue.pull_request ? true : false
  const repoName = issue.repository_url?.split("/repos/")[1] || ""
  const url = issue.html_url || `https://github.com/${repoName}/issues/${number}`
  const createdAt = issue.created_at ? new Date(issue.created_at).toLocaleDateString() : ""
  const updatedAt = issue.updated_at ? new Date(issue.updated_at).toLocaleDateString() : ""

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          {isPR ? (
            <GitPullRequest className="h-5 w-5 text-purple-500" />
          ) : state === "open" ? (
            <AlertCircle className="h-5 w-5 text-green-500" />
          ) : (
            <CheckCircle2 className="h-5 w-5 text-red-500" />
          )}
          <div>
            <CardTitle className="text-base">
              <Link href={url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                {title}
              </Link>
              <span className="text-gray-500 ml-2">#{number}</span>
            </CardTitle>
            <CardDescription>
              <Link href={`/repos/${repoName}`} className="hover:underline">
                {repoName}
              </Link>
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2 items-center">
          <Badge variant={state === "open" ? "default" : "secondary"}>{state === "open" ? "Open" : "Closed"}</Badge>
          {isPR && <Badge variant="outline">Pull Request</Badge>}
          <span className="text-xs text-gray-500 dark:text-gray-400">
            Created on {createdAt} • Updated on {updatedAt}
          </span>
        </div>
      </CardContent>
    </Card>
  )
}

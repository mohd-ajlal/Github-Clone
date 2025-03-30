import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Star, GitFork } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function RepoCard({ repo, variant = "card" }) {
  if (!repo) return null

  // Handle different API response formats
  const owner = repo.owner?.login || repo.owner || repo.full_name?.split("/")[0] || ""
  const name = repo.name || repo.full_name?.split("/")[1] || ""
  const fullName = repo.full_name || `${owner}/${name}`
  const description = repo.description || "No description provided"
  const stars = repo.stargazers_count || repo.stars || 0
  const forks = repo.forks_count || repo.forks || 0
  const watchers = repo.watchers_count || repo.watchers || 0
  const language = repo.language || ""
  const updatedAt = repo.updated_at ? new Date(repo.updated_at).toLocaleDateString() : "Unknown"
  const avatarUrl = repo.owner?.avatar_url || "/placeholder.svg?height=24&width=24"

  if (variant === "list") {
    return (
      <div className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex-1">
            <Link href={`/repos/${owner}/${name}`} className="text-lg font-semibold hover:underline">
              {name}
            </Link>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{description}</p>
            <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-500 dark:text-gray-400">
              {language && (
                <div className="flex items-center">
                  <span className="inline-block w-3 h-3 rounded-full bg-blue-500 mr-1"></span>
                  <span>{language}</span>
                </div>
              )}
              <div className="flex items-center">
                <Star className="mr-1 h-4 w-4" />
                <span>{stars}</span>
              </div>
              <div className="flex items-center">
                <GitFork className="mr-1 h-4 w-4" />
                <span>{forks}</span>
              </div>
              <div className="flex items-center">
                <span>Updated {updatedAt}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Star className="h-5 w-5 text-gray-400 hover:text-yellow-400 cursor-pointer" />
            <GitFork className="h-5 w-5 text-gray-400 hover:text-blue-400 cursor-pointer" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <Card className="overflow-hidden h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">
          <Link href={`/repos/${owner}/${name}`} className="hover:underline">
            {fullName}
          </Link>
        </CardTitle>
        <CardDescription className="line-clamp-2">{description}</CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
          <div className="mr-4 flex items-center">
            <Star className="mr-1 h-4 w-4" />
            <span>{stars}</span>
          </div>
          <div className="mr-4 flex items-center">
            <GitFork className="mr-1 h-4 w-4" />
            <span>{forks}</span>
          </div>
          {language && (
            <div className="flex items-center">
              <span className="inline-block w-3 h-3 rounded-full bg-blue-500 mr-1"></span>
              <span>{language}</span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="pt-2">
        <div className="flex items-center">
          <div className="w-6 h-6 rounded-full overflow-hidden mr-2">
            <Image src={avatarUrl || "/placeholder.svg"} alt="User avatar" width={24} height={24} />
          </div>
          <span className="text-sm">Updated {updatedAt}</span>
        </div>
      </CardFooter>
    </Card>
  )
}

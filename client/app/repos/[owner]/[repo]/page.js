"use client"

import { useState, useEffect, use } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, GitFork, Eye, Code, GitBranch, AlertCircle, GitPullRequest } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/context/auth-context"
import LoadingSpinner from "@/components/loading-spinner"
import RepoContributors from "@/components/repo-contributors"
import RepoLanguages from "@/components/repo-languages"
import RepoReadme from "@/components/RepoReadme"
import RepoIssues from "@/components/RepoIssues"
import RepoPulls from "@/components/RepoPulls"

export default function RepoPage({ params: paramsPromise }) {
    const params = use(paramsPromise)
  
  const { owner, repo } = params
  const [repoData, setRepoData] = useState(null)
  const [readme, setReadme] = useState(null)
  const [isStarred, setIsStarred] = useState(false)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("code")

  const { toast } = useToast()
  const { user, isAuthenticated } = useAuth()

  useEffect(() => {
    fetchRepoData()
  }, [owner, repo])

  const fetchRepoData = async () => {
    setLoading(true)
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/repos/${owner}/${repo}`,
        { credentials: "include" },
      )

      if (!response.ok) {
        throw new Error("Failed to fetch repository data")
      }

      const data = await response.json()
      setRepoData(data.repo)
      setReadme(data.readme)
      setIsStarred(data.isStarred)
    } catch (error) {
      console.error("Error fetching repo data:", error)
      toast({
        title: "Error",
        description: "Failed to load repository data. Please try again later.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleStar = async () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please sign in to star repositories",
        variant: "default",
      })
      return
    }

    try {
      const endpoint = isStarred ? "unstar" : "star"
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/repos/${endpoint}/${owner}/${repo}`,
        {
          method: "POST",
          credentials: "include",
        },
      )

      if (!response.ok) {
        throw new Error(`Failed to ${isStarred ? "unstar" : "star"} repository`)
      }

      setIsStarred(!isStarred)
      toast({
        title: isStarred ? "Repository unstarred" : "Repository starred",
        description: isStarred ? "Repository removed from your stars" : "Repository added to your stars",
        variant: "default",
      })
    } catch (error) {
      console.error("Error starring repo:", error)
      toast({
        title: "Error",
        description: `Failed to ${isStarred ? "unstar" : "star"} repository. Please try again.`,
        variant: "destructive",
      })
    }
  }

  const handleFork = async () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please sign in to fork repositories",
        variant: "default",
      })
      return
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/repos/fork/${owner}/${repo}`,
        {
          method: "POST",
          credentials: "include",
        },
      )

      if (!response.ok) {
        throw new Error("Failed to fork repository")
      }

      const data = await response.json()

      toast({
        title: "Repository forked",
        description: "Repository has been forked to your account",
        variant: "default",
      })

      // Redirect to the forked repo
      if (data.fork && data.fork.html_url) {
        window.location.href = data.fork.html_url
      }
    } catch (error) {
      console.error("Error forking repo:", error)
      toast({
        title: "Error",
        description: "Failed to fork repository. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-[60vh]">
        <LoadingSpinner />
      </div>
    )
  }

  if (!repoData) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-3xl font-bold mb-4">Repository Not Found</h1>
        <p className="mb-6">The repository you're looking for doesn't exist or you don't have access to it.</p>
        <Button asChild>
          <Link href="/explore">Explore Repositories</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Repository Header */}
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <Link href={`/users/${owner}`} className="text-gray-500 hover:underline flex items-center">
            <div className="w-6 h-6 rounded-full overflow-hidden mr-2">
              <Image
                src={repoData.owner?.avatar_url || `/placeholder.svg?height=24&width=24`}
                alt={owner}
                width={24}
                height={24}
              />
            </div>
            <span>{owner}</span>
          </Link>
          <span className="mx-2">/</span>
          <h1 className="text-2xl font-bold">{repo}</h1>
          <Badge variant="outline" className="ml-3">
            {repoData.private ? "Private" : "Public"}
          </Badge>
        </div>

        <p className="text-gray-500 dark:text-gray-400 mb-6">{repoData.description || "No description provided"}</p>

        <div className="flex flex-wrap gap-3 mb-6">
          <Button variant={isStarred ? "default" : "outline"} size="sm" onClick={handleStar}>
            <Star className={`mr-1 h-4 w-4 ${isStarred ? "fill-current" : ""}`} />
            {isStarred ? "Starred" : "Star"}
            <span className="ml-1">({repoData.stargazers_count || 0})</span>
          </Button>

          <Button variant="outline" size="sm" onClick={handleFork}>
            <GitFork className="mr-1 h-4 w-4" />
            Fork
            <span className="ml-1">({repoData.forks_count || 0})</span>
          </Button>

          <Button variant="outline" size="sm" asChild>
            <Link href={repoData.html_url} target="_blank" rel="noopener noreferrer">
              <Eye className="mr-1 h-4 w-4" />
              Watch
              <span className="ml-1">({repoData.watchers_count || 0})</span>
            </Link>
          </Button>
        </div>

        <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400">
          {repoData.language && (
            <div className="flex items-center">
              <span className="inline-block w-3 h-3 rounded-full bg-yellow-500 mr-1"></span>
              <span>{repoData.language}</span>
            </div>
          )}

          {repoData.license && (
            <div className="flex items-center">
              <span>{repoData.license.name}</span>
            </div>
          )}

          {repoData.updated_at && (
            <div className="flex items-center">
              <span>Updated {new Date(repoData.updated_at).toLocaleDateString()}</span>
            </div>
          )}
        </div>
      </div>

      {/* Repository Content */}
      <Tabs defaultValue="code" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="code">
            <Code className="mr-1 h-4 w-4" /> Code
          </TabsTrigger>
          <TabsTrigger value="issues">
            <AlertCircle className="mr-1 h-4 w-4" /> Issues
            {repoData.open_issues_count > 0 && (
              <span className="ml-1 text-xs bg-gray-200 dark:bg-gray-700 px-2 py-0.5 rounded-full">
                {repoData.open_issues_count}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="pulls">
            <GitPullRequest className="mr-1 h-4 w-4" /> Pull Requests
          </TabsTrigger>
          <TabsTrigger value="insights">
            <GitBranch className="mr-1 h-4 w-4" /> Insights
          </TabsTrigger>
        </TabsList>

        <TabsContent value="code" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <RepoReadme owner={owner} repo={repo} readme={readme} />
            </div>
            <div className="space-y-6">
              <div className="border rounded-lg p-4">
                <h3 className="font-medium mb-3">About</h3>
                <div className="space-y-3 text-sm">
                  {repoData.description && <p>{repoData.description}</p>}

                  {repoData.homepage && (
                    <p>
                      <Link
                        href={repoData.homepage}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline"
                      >
                        {repoData.homepage}
                      </Link>
                    </p>
                  )}

                  <RepoLanguages owner={owner} repo={repo} />
                </div>
              </div>

              <RepoContributors owner={owner} repo={repo} />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="issues" className="mt-0">
          <RepoIssues owner={owner} repo={repo} />
        </TabsContent>

        <TabsContent value="pulls" className="mt-0">
          <RepoPulls owner={owner} repo={repo} />
        </TabsContent>

        <TabsContent value="insights" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border rounded-lg p-6">
              <h3 className="text-lg font-medium mb-4">Contributors</h3>
              <RepoContributors owner={owner} repo={repo} limit={5} />
            </div>

            <div className="border rounded-lg p-6">
              <h3 className="text-lg font-medium mb-4">Languages</h3>
              <RepoLanguages owner={owner} repo={repo} showChart={true} />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

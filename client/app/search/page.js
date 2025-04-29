"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search } from "lucide-react"
import RepoCard from "@/components/repo-card"
import UserCard from "@/components/user-card"
import CodeSearchResult from "@/components/code-search-result"
import IssueSearchResult from "@/components/issue-search-result"
import LoadingSpinner from "@/components/loading-spinner"
import { useToast } from "@/hooks/use-toast"

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("repos")
  const [sortOption, setSortOption] = useState("stars")
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState({
    repos: [],
    users: [],
    code: [],
    issues: [],
  })
  const [hasSearched, setHasSearched] = useState(false)

  const { toast } = useToast()

  const handleSearch = async (e) => {
    e.preventDefault()

    if (!searchQuery.trim()) {
      toast({
        title: "Search query required",
        description: "Please enter a search term",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    setHasSearched(true)

    try {
      let endpoint = ""

      switch (activeTab) {
        case "repos":
          endpoint = `/api/search/repos?q=${encodeURIComponent(searchQuery)}&sort=${sortOption}`
          break
        case "users":
          endpoint = `/api/search/users?q=${encodeURIComponent(searchQuery)}&sort=followers`
          break
        case "code":
          endpoint = `/api/search/code?q=${encodeURIComponent(searchQuery)}`
          break
        case "issues":
          endpoint = `/api/search/issues?q=${encodeURIComponent(searchQuery)}&sort=updated`
          break
        default:
          endpoint = `/api/search/repos?q=${encodeURIComponent(searchQuery)}`
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}${endpoint}`, {
        credentials: "include",
      })

      if (!response.ok) {
        throw new Error("Search failed")
      }

      const data = await response.json()

      // Update the specific tab results
      setResults((prev) => ({
        ...prev,
        [activeTab]: data.repos || data.users || data.code || data.issues || [],
      }))
    } catch (error) {
      console.error("Search error:", error)
      toast({
        title: "Search failed",
        description: "An error occurred while searching. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleTabChange = (value) => {
    setActiveTab(value)
    if (hasSearched && searchQuery) {
      // Re-run search when changing tabs if we've already searched
      handleSearch({ preventDefault: () => {} })
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Search GitHub</h1>
        <p className="text-gray-500 dark:text-gray-400">Find repositories, users, code, and issues</p>
      </div>

      <Card className="mb-8">
        <CardContent className="pt-6">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Input
                  type="text"
                  placeholder="Search GitHub..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full"
                />
              </div>

              {activeTab === "repos" && (
                <Select value={sortOption} onValueChange={setSortOption}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="stars">Stars</SelectItem>
                    <SelectItem value="forks">Forks</SelectItem>
                    <SelectItem value="updated">Updated</SelectItem>
                  </SelectContent>
                </Select>
              )}

              <Button type="submit" className="md:w-auto">
                <Search className="mr-2 h-4 w-4" /> Search
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Tabs defaultValue="repos" value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="repos">Repositories</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="code">Code</TabsTrigger>
          <TabsTrigger value="issues">Issues</TabsTrigger>
        </TabsList>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <LoadingSpinner />
          </div>
        ) : (
          <>
            <TabsContent value="repos" className="mt-0">
              {hasSearched ? (
                results.repos && results.repos.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {results.repos.map((repo, index) => (
                      <RepoCard key={repo.id || index} repo={repo} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10">
                    <p>No repositories found matching your search criteria.</p>
                  </div>
                )
              ) : (
                <div className="text-center py-10 text-gray-500">
                  <Search className="mx-auto h-12 w-12 mb-4 opacity-20" />
                  <p>Enter a search term to find repositories</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="users" className="mt-0">
              {hasSearched ? (
                results.users && results.users.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {results.users.map((user, index) => (
                      <UserCard key={user.id || index} user={user} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10">
                    <p>No users found matching your search criteria.</p>
                  </div>
                )
              ) : (
                <div className="text-center py-10 text-gray-500">
                  <Search className="mx-auto h-12 w-12 mb-4 opacity-20" />
                  <p>Enter a search term to find users</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="code" className="mt-0">
              {hasSearched ? (
                results.code && results.code.length > 0 ? (
                  <div className="space-y-4">
                    {results.code.map((item, index) => (
                      <CodeSearchResult key={item.sha || index} item={item} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10">
                    <p>No code found matching your search criteria.</p>
                  </div>
                )
              ) : (
                <div className="text-center py-10 text-gray-500">
                  <Search className="mx-auto h-12 w-12 mb-4 opacity-20" />
                  <p>Enter a search term to find code</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="issues" className="mt-0">
              {hasSearched ? (
                results.issues && results.issues.length > 0 ? (
                  <div className="space-y-4">
                    {results.issues.map((issue, index) => (
                      <IssueSearchResult key={issue.id || index} issue={issue} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10">
                    <p>No issues found matching your search criteria.</p>
                  </div>
                )
              ) : (
                <div className="text-center py-10 text-gray-500">
                  <Search className="mx-auto h-12 w-12 mb-4 opacity-20" />
                  <p>Enter a search term to find issues</p>
                </div>
              )}
            </TabsContent>
          </>
        )}
      </Tabs>
    </div>
  )
}

"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Compass } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/context/auth-context"
import RepoCard from "@/components/repo-card"
import UserCard from "@/components/user-card"
import TopicCard from "@/components/topic-card"
import LoadingSpinner from "@/components/loading-spinner"

export default function ExplorePage() {
  const [activeTab, setActiveTab] = useState("trending")
  const [language, setLanguage] = useState("javascript")
  const [timeframe, setTimeframe] = useState("daily")
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState({
    trending: [],
    popular: [],
    users: [],
    topics: [],
  })

  const { toast } = useToast()
  const { user, isAuthenticated } = useAuth()

  useEffect(() => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Some features may be limited. Please sign in for full access.",
        variant: "default",
      })
    }

    fetchData(activeTab)
  }, [activeTab, language, timeframe, isAuthenticated])

  const fetchData = async (tab) => {
    setLoading(true)
    try {
      let endpoint = ""

      switch (tab) {
        case "trending":
          endpoint = `/api/explore/trending?since=${timeframe}&language=${language}`
          break
        case "popular":
          endpoint = `/api/explore/repos/${language}`
          break
        case "users":
          endpoint = `/api/explore/users`
          break
        case "topics":
          endpoint = `/api/explore/topics`
          break
        default:
          endpoint = `/api/explore/trending`
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}${endpoint}`, {
        credentials: "include",
      })

      if (!response.ok) {
        throw new Error("Failed to fetch data")
      }

      const result = await response.json()

      // Update the specific tab data
      setData((prev) => ({
        ...prev,
        [tab]: result.repos || result.users || result.topics || [],
      }))
    } catch (error) {
      console.error("Error fetching data:", error)
      toast({
        title: "Error",
        description: "Failed to load data. Please try again later.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleTabChange = (value) => {
    setActiveTab(value)
  }

  const handleLanguageChange = (value) => {
    setLanguage(value)
  }

  const handleTimeframeChange = (value) => {
    setTimeframe(value)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Explore</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Discover repositories, users, and topics from around the GitHub community
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <Button asChild>
            <Link href="/search">
              <Compass className="mr-2 h-4 w-4" /> Advanced Search
            </Link>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="trending" value={activeTab} onValueChange={handleTabChange} className="w-full">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <TabsList className="mb-4 md:mb-0">
            <TabsTrigger value="trending">Trending</TabsTrigger>
            <TabsTrigger value="popular">Popular</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="topics">Topics</TabsTrigger>
          </TabsList>

          {(activeTab === "trending" || activeTab === "popular") && (
            <div className="flex flex-col sm:flex-row gap-2">
              <Select value={language} onValueChange={handleLanguageChange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="javascript">JavaScript</SelectItem>
                  <SelectItem value="python">Python</SelectItem>
                  <SelectItem value="java">Java</SelectItem>
                  <SelectItem value="typescript">TypeScript</SelectItem>
                  <SelectItem value="go">Go</SelectItem>
                  <SelectItem value="rust">Rust</SelectItem>
                </SelectContent>
              </Select>

              {activeTab === "trending" && (
                <Select value={timeframe} onValueChange={handleTimeframeChange}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Timeframe" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Today</SelectItem>
                    <SelectItem value="weekly">This week</SelectItem>
                    <SelectItem value="monthly">This month</SelectItem>
                  </SelectContent>
                </Select>
              )}
            </div>
          )}
        </div>

        <div className="mt-6">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <LoadingSpinner />
            </div>
          ) : (
            <>
              <TabsContent value="trending" className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {data.trending && data.trending.length > 0 ? (
                    data.trending.map((repo, index) => <RepoCard key={repo.id || index} repo={repo} />)
                  ) : (
                    <div className="col-span-3 text-center py-10">
                      <p>No trending repositories found. Try a different language or timeframe.</p>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="popular" className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {data.popular && data.popular.length > 0 ? (
                    data.popular.map((repo, index) => <RepoCard key={repo.id || index} repo={repo} />)
                  ) : (
                    <div className="col-span-3 text-center py-10">
                      <p>No popular repositories found. Try a different language.</p>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="users" className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {data.users && data.users.length > 0 ? (
                    data.users.map((user, index) => <UserCard key={user.id || index} user={user} />)
                  ) : (
                    <div className="col-span-3 text-center py-10">
                      <p>No users found.</p>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="topics" className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {data.topics && data.topics.length > 0 ? (
                    data.topics.map((topic, index) => <TopicCard key={topic.name || index} topic={topic} />)
                  ) : (
                    <div className="col-span-4 text-center py-10">
                      <p>No topics found.</p>
                    </div>
                  )}
                </div>
              </TabsContent>
            </>
          )}
        </div>
      </Tabs>
    </div>
  )
}

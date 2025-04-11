"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Heart, Users, MapPin, Building, Calendar } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/context/auth-context"
import LoadingSpinner from "@/components/loading-spinner"
import RepoCard from "@/components/repo-card"
import UserActivity from "@/components/user-activity"
import { use } from "react"
export default function UserProfilePage({ params: paramsPromise }) {
  const params = use(paramsPromise)
  const { username } = params

  const [userProfile, setUserProfile] = useState(null)
  const [repos, setRepos] = useState([])
  const [isLiked, setIsLiked] = useState(false)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")
  const [stats, setStats] = useState(null)

  const { toast } = useToast()
  const { user, isAuthenticated } = useAuth()

  useEffect(() => {
    fetchUserData()
  }, [username])

  const fetchUserData = async () => {
    setLoading(true)
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/users/profile/${username}`,
        { credentials: "include" },
      )

      if (!response.ok) {
        throw new Error("Failed to fetch user data")
      }

      const data = await response.json()
      setUserProfile(data.userProfile)
      setRepos(data.repos)
      setIsLiked(data.userProfile.isLiked || false)

      // Fetch user stats
      fetchUserStats()
    } catch (error) {
      console.error("Error fetching user data:", error)
      toast({
        title: "Error",
        description: "Failed to load user profile. Please try again later.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchUserStats = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/users/stats?username=${username}`,
        { credentials: "include" },
      )

      if (!response.ok) {
        throw new Error("Failed to fetch user stats")
      }

      const data = await response.json()
      setStats(data)
    } catch (error) {
      console.error("Error fetching user stats:", error)
    }
  }

  const handleLike = async () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please sign in to like profiles",
        variant: "default",
      })
      return
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/users/like/${username}`,
        {
          method: "POST",
          credentials: "include",
        },
      )

      if (!response.ok) {
        throw new Error("Failed to like profile")
      }

      setIsLiked(true)
      toast({
        title: "Profile liked",
        description: `You've liked ${username}'s profile`,
        variant: "default",
      })
    } catch (error) {
      console.error("Error liking profile:", error)
      toast({
        title: "Error",
        description: "Failed to like profile. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleFollow = async () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please sign in to follow users",
        variant: "default",
      })
      return
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/users/follow/${username}`,
        {
          method: "POST",
          credentials: "include",
        },
      )

      if (!response.ok) {
        throw new Error("Failed to follow user")
      }

      toast({
        title: "User followed",
        description: `You are now following ${username}`,
        variant: "default",
      })

      // Refresh user data to update follow status
      fetchUserData()
    } catch (error) {
      console.error("Error following user:", error)
      toast({
        title: "Error",
        description: "Failed to follow user. Please try again.",
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

  if (!userProfile) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-3xl font-bold mb-4">User Not Found</h1>
        <p className="mb-6">The user you're looking for doesn't exist or you don't have access to their profile.</p>
        <Button asChild>
          <Link href="/explore">Explore Users</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* User Profile Sidebar */}
        <div className="md:col-span-1">
          <div className="sticky top-20">
            <div className="flex flex-col items-center md:items-start">
              <div className="w-32 h-32 rounded-full overflow-hidden mb-4">
                <Image
                  src={userProfile.avatar_url || `/placeholder.svg?height=128&width=128`}
                  alt={username}
                  width={128}
                  height={128}
                />
              </div>

              <h1 className="text-2xl font-bold mb-1">{userProfile.name || username}</h1>
              <p className="text-gray-500 dark:text-gray-400 mb-4">{username}</p>

              <p className="text-gray-700 dark:text-gray-300 mb-4 text-center md:text-left">
                {userProfile.bio || "No bio provided"}
              </p>

              <div className="flex flex-wrap gap-3 mb-6 w-full">
                <Button
                  variant={isLiked ? "default" : "outline"}
                  size="sm"
                  onClick={handleLike}
                  disabled={isLiked}
                  className="w-full"
                >
                  <Heart className={`mr-1 h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
                  {isLiked ? "Liked" : "Like Profile"}
                </Button>

                <Button variant="outline" size="sm" onClick={handleFollow} className="w-full">
                  <Users className="mr-1 h-4 w-4" />
                  Follow
                </Button>
              </div>

              <div className="space-y-3 w-full">
                {userProfile.company && (
                  <div className="flex items-center text-sm">
                    <Building className="mr-2 h-4 w-4 text-gray-500" />
                    <span>{userProfile.company}</span>
                  </div>
                )}

                {userProfile.location && (
                  <div className="flex items-center text-sm">
                    <MapPin className="mr-2 h-4 w-4 text-gray-500" />
                    <span>{userProfile.location}</span>
                  </div>
                )}

                {userProfile.created_at && (
                  <div className="flex items-center text-sm">
                    <Calendar className="mr-2 h-4 w-4 text-gray-500" />
                    <span>Joined {new Date(userProfile.created_at).toLocaleDateString()}</span>
                  </div>
                )}
              </div>

              <div className="flex gap-4 mt-6 w-full">
                <div className="flex items-center">
                  <Users className="mr-1 h-4 w-4 text-gray-500" />
                  <Link href={`/users/${username}/followers`} className="text-sm hover:underline">
                    <span className="font-bold">{userProfile.followers}</span> followers
                  </Link>
                </div>
                <div className="flex items-center">
                  <Users className="mr-1 h-4 w-4 text-gray-500" />
                  <Link href={`/users/${username}/following`} className="text-sm hover:underline">
                    <span className="font-bold">{userProfile.following}</span> following
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* User Content */}
        <div className="md:col-span-3">
          <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="repositories">Repositories</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
              <TabsTrigger value="stats">Stats</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-0">
              {/* Pinned Repositories */}
              <div className="mb-8">
                <h2 className="text-xl font-bold mb-4">Pinned Repositories</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {repos.slice(0, 6).map((repo, index) => (
                    <RepoCard key={repo.id || index} repo={repo} />
                  ))}
                </div>
              </div>

              {/* Contribution Activity */}
              <div>
                <h2 className="text-xl font-bold mb-4">Contribution Activity</h2>
                <UserActivity username={username} limit={5} />
              </div>
            </TabsContent>

            <TabsContent value="repositories" className="mt-0">
              <div className="mb-6">
                <h2 className="text-xl font-bold mb-4">Repositories</h2>
                <div className="grid grid-cols-1 gap-4">
                  {repos.map((repo, index) => (
                    <RepoCard key={repo.id || index} repo={repo} variant="list" />
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="activity" className="mt-0">
              <div>
                <h2 className="text-xl font-bold mb-4">Activity</h2>
                <UserActivity username={username} />
              </div>
            </TabsContent>

            <TabsContent value="stats" className="mt-0">
              {stats ? (
                <div className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Profile</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-gray-500">Followers</span>
                            <span className="font-medium">{stats.profile.followers}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Following</span>
                            <span className="font-medium">{stats.profile.following}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Repositories</span>
                            <span className="font-medium">{stats.profile.public_repos}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Gists</span>
                            <span className="font-medium">{stats.profile.public_gists}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Repositories</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-gray-500">Total Stars</span>
                            <span className="font-medium">{stats.repos.totalStars}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Total Forks</span>
                            <span className="font-medium">{stats.repos.totalForks}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Total Watchers</span>
                            <span className="font-medium">{stats.repos.totalWatchers}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Contributions</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-gray-500">Commits</span>
                            <span className="font-medium">{stats.contributions.commits}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Pull Requests</span>
                            <span className="font-medium">{stats.contributions.pullRequests}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Issues</span>
                            <span className="font-medium">{stats.contributions.issues}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Reviews</span>
                            <span className="font-medium">{stats.contributions.reviews}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle>Languages</CardTitle>
                      <CardDescription>Languages used across repositories</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {Object.entries(stats.repos.languages || {}).map(([language, count]) => (
                          <div key={language} className="flex items-center">
                            <span className="inline-block w-3 h-3 rounded-full bg-blue-500 mr-2"></span>
                            <span>{language}</span>
                            <Badge variant="outline" className="ml-2">
                              {count}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <div className="flex justify-center items-center py-20">
                  <LoadingSpinner />
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

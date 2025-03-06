import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { GithubIcon, Star, GitFork, Users, Search, Compass, Code2 } from "lucide-react"
import Image from "next/image"

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="py-12 md:py-24 lg:py-32 flex flex-col items-center text-center">
        <div className="container px-4 md:px-6">
          <div className="space-y-4 md:space-y-6">
            <div className="flex justify-center">
              <GithubIcon className="h-16 w-16 md:h-24 md:w-24" />
            </div>
            <h1 className="text-3xl md:text-5xl font-bold tracking-tighter">Your GitHub Experience, Reimagined</h1>
            <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
              Discover repositories, connect with developers, and explore the world of code.
            </p>
            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <Link href="/login">
                <Button size="lg" className="w-full md:w-auto">
                  <GithubIcon className="mr-2 h-4 w-4" /> Sign in with GitHub
                </Button>
              </Link>
              <Link href="/explore">
                <Button size="lg" variant="outline" className="w-full md:w-auto">
                  <Compass className="mr-2 h-4 w-4" /> Explore
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Search className="mr-2 h-5 w-5" /> Search
                </CardTitle>
                <CardDescription>Find repositories, users, and code with powerful search capabilities</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Search across millions of repositories and users to find exactly what you're looking for.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Star className="mr-2 h-5 w-5" /> Star
                </CardTitle>
                <CardDescription>Save your favorite repositories and keep track of updates</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Star repositories to show appreciation and keep them in your personal collection.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <GitFork className="mr-2 h-5 w-5" /> Fork
                </CardTitle>
                <CardDescription>Create your own copy of any repository to modify and improve</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Fork repositories to propose changes to the original project or start your own version.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="mr-2 h-5 w-5" /> Connect
                </CardTitle>
                <CardDescription>Follow developers and collaborate on projects</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Build your network by following other developers and engaging with their work.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Compass className="mr-2 h-5 w-5" /> Explore
                </CardTitle>
                <CardDescription>Discover trending repositories and popular topics</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Stay up-to-date with the latest trends and discover new projects in the developer community.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Code2 className="mr-2 h-5 w-5" /> Code
                </CardTitle>
                <CardDescription>Browse code with syntax highlighting and navigation</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Easily navigate through repositories with our intuitive code browser and search functionality.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Trending Section */}
      <section className="py-12 md:py-24">
        <div className="container px-4 md:px-6">
          <h2 className="text-2xl md:text-3xl font-bold mb-8">Trending Repositories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">
                    <Link href={`/repos/example/repo-${i}`} className="hover:underline">
                      example/repo-{i}
                    </Link>
                  </CardTitle>
                  <CardDescription>A sample repository showcasing various features</CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <div className="mr-4 flex items-center">
                      <Star className="mr-1 h-4 w-4" />
                      <span>{i * 123}</span>
                    </div>
                    <div className="mr-4 flex items-center">
                      <GitFork className="mr-1 h-4 w-4" />
                      <span>{i * 45}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="inline-block w-3 h-3 rounded-full bg-yellow-500 mr-1"></span>
                      <span>JavaScript</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="pt-2">
                  <div className="flex items-center">
                    <div className="w-6 h-6 rounded-full overflow-hidden mr-2">
                      <Image src={`/placeholder.svg?height=24&width=24`} alt="User avatar" width={24} height={24} />
                    </div>
                    <span className="text-sm">Updated 3 days ago</span>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link href="/explore">
              <Button variant="outline">View More Repositories</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

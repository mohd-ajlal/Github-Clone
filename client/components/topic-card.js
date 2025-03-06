import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function TopicCard({ topic }) {
  if (!topic) return null

  // Handle different API response formats
  const name = topic.name || ""
  const description = topic.description || "No description provided"
  const count = topic.count || topic.repository_count || 0

  return (
    <Card className="overflow-hidden h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg capitalize">{name}</CardTitle>
        <CardDescription className="line-clamp-2">{description}</CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          <span className="font-medium">{count}</span> repositories
        </p>
      </CardContent>
      <CardFooter className="pt-2">
        <Button variant="outline" size="sm" className="w-full" asChild>
          <Link href={`/explore/topic/${name}`}>Browse Topic</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

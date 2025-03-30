import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileCode } from "lucide-react"
import Link from "next/link"

export default function CodeSearchResult({ item }) {
  if (!item) return null

  const repoName = item.repository?.full_name || ""
  const path = item.path || ""
  const name = item.name || path.split("/").pop() || ""
  const url = item.html_url || `https://github.com/${repoName}/blob/master/${path}`

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <FileCode className="mr-2 h-4 w-4 text-gray-500" />
            <CardTitle className="text-base">
              <Link href={url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                {name}
              </Link>
            </CardTitle>
          </div>
          <CardDescription className="text-xs">
            <Link href={`/repos/${repoName}`} className="hover:underline">
              {repoName}
            </Link>
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-sm bg-muted p-3 rounded-md overflow-x-auto">
          <pre className="text-xs">
            <code>{item.text || "Code snippet not available"}</code>
          </pre>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
          Path: <span className="font-mono">{path}</span>
        </p>
      </CardContent>
    </Card>
  )
}

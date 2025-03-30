"use client"

import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"
import LoadingSpinner from "@/components/loading-spinner"

export default function RepoLanguages({ owner, repo, showChart = false }) {
  const [languages, setLanguages] = useState({})
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchLanguages()
  }, [owner, repo])

  const fetchLanguages = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/repos/languages/${owner}/${repo}`,
        { credentials: "include" },
      )

      if (!response.ok) {
        throw new Error("Failed to fetch languages")
      }

      const data = await response.json()
      setLanguages(data.languages)
    } catch (error) {
      console.error("Error fetching languages:", error)
      toast({
        title: "Error",
        description: "Failed to load language data. Please try again later.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <LoadingSpinner size="small" />
  }

  if (!languages || Object.keys(languages).length === 0) {
    return <p className="text-sm text-gray-500 dark:text-gray-400">No language data available</p>
  }

  // Calculate total bytes for percentage calculation
  const totalBytes = Object.values(languages).reduce((sum, bytes) => sum + bytes, 0)

  if (showChart) {
    // Create color map for languages
    const colorMap = {
      JavaScript: "#f1e05a",
      TypeScript: "#2b7489",
      HTML: "#e34c26",
      CSS: "#563d7c",
      Python: "#3572A5",
      Java: "#b07219",
      Ruby: "#701516",
      Go: "#00ADD8",
      PHP: "#4F5D95",
      C: "#555555",
      "C++": "#f34b7d",
      "C#": "#178600",
      Swift: "#ffac45",
      Kotlin: "#F18E33",
      Rust: "#dea584",
      Dart: "#00B4AB",
    }

    return (
      <div className="space-y-3">
        <div className="h-4 w-full rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700">
          {Object.entries(languages).map(([lang, bytes], index) => {
            const percentage = (bytes / totalBytes) * 100
            const color = colorMap[lang] || `hsl(${index * 40}, 70%, 50%)`
            return (
              <div
                key={lang}
                className="h-full float-left"
                style={{
                  width: `${percentage}%`,
                  backgroundColor: color,
                }}
                title={`${lang}: ${percentage.toFixed(1)}%`}
              ></div>
            )
          })}
        </div>
        <div className="flex flex-wrap gap-4">
          {Object.entries(languages)
            .sort((a, b) => b[1] - a[1])
            .map(([lang, bytes], index) => {
              const percentage = (bytes / totalBytes) * 100
              const color = colorMap[lang] || `hsl(${index * 40}, 70%, 50%)`
              return (
                <div key={lang} className="flex items-center">
                  <span className="inline-block w-3 h-3 rounded-full mr-1" style={{ backgroundColor: color }}></span>
                  <span className="text-sm">
                    {lang} <span className="text-gray-500 dark:text-gray-400">{percentage.toFixed(1)}%</span>
                  </span>
                </div>
              )
            })}
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-wrap gap-2">
      {Object.entries(languages)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([language, bytes]) => {
          const percentage = ((bytes / totalBytes) * 100).toFixed(1)
          return (
            <div key={language} className="flex items-center">
              <span className="inline-block w-3 h-3 rounded-full bg-blue-500 mr-1"></span>
              <span className="text-sm">
                {language} <span className="text-gray-500 dark:text-gray-400">{percentage}%</span>
              </span>
            </div>
          )
        })}
    </div>
  )
}

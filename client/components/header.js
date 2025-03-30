"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { GithubIcon, Search, Menu, X, User, LogOut, Star, GitFork, Compass } from "lucide-react"
import { useAuth } from "@/context/auth-context"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useMobile } from "@/hooks/use-mobile"

export default function Header() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isScrolled, setIsScrolled] = useState(false)
  const pathname = usePathname()
  const { user, isAuthenticated, logout } = useAuth()
  const isMobile = useMobile()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`
    }
  }

  const navItems = [
    { name: "Explore", href: "/explore", icon: <Compass className="h-4 w-4 mr-2" /> },
    { name: "Search", href: "/search", icon: <Search className="h-4 w-4 mr-2" /> },
  ]

  return (
    <header
      className={`sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur transition-shadow ${
        isScrolled ? "shadow-sm" : ""
      }`}
    >
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6 md:gap-8">
          <Link href="/" className="flex items-center space-x-2">
            <GithubIcon className="h-6 w-6" />
            <span className="hidden font-bold sm:inline-block">GitHub Clone</span>
          </Link>

          {!isMobile && (
            <nav className="hidden md:flex gap-6">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center text-sm font-medium transition-colors hover:text-primary ${
                    pathname === item.href ? "text-foreground" : "text-muted-foreground"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          )}
        </div>

        <div className="flex items-center gap-4">
          {!isMobile && (
            <form onSubmit={handleSearch} className="hidden md:flex relative w-full max-w-sm items-center">
              <Search className="absolute left-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search GitHub..."
                className="w-full pl-8 bg-muted"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>
          )}

          {isAuthenticated ? (
            <DropdownMenu className="bg-amber-800DialogTitle">
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.avatarUrl || "/placeholder.svg"} alt={user?.username} />
                    <AvatarFallback>{user?.username?.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user?.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">{user?.username}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href={`/users/${user?.username}`} className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href={`/users/${user?.username}?tab=repositories`} className="cursor-pointer">
                    <GitFork className="mr-2 h-4 w-4" />
                    <span>Repositories</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href={`/users/${user?.username}?tab=stars`} className="cursor-pointer">
                    <Star className="mr-2 h-4 w-4" />
                    <span>Stars</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild size="sm">
              <Link href="/login">Sign In</Link>
            </Button>
          )}

          {isMobile && (
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <div className="flex flex-col gap-6 px-2">
                  <div className="flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2">
                      <GithubIcon className="h-6 w-6" />
                      <span className="font-bold">GitHub Clone</span>
                    </Link>
                    <SheetTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <X className="h-5 w-5" />
                        <span className="sr-only">Close menu</span>
                      </Button>
                    </SheetTrigger>
                  </div>

                  <form onSubmit={handleSearch} className="relative w-full items-center">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search GitHub..."
                      className="w-full pl-8 bg-muted"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </form>

                  <nav className="flex flex-col gap-4">
                    {navItems.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={`flex items-center text-sm font-medium transition-colors hover:text-primary ${
                          pathname === item.href ? "text-foreground" : "text-muted-foreground"
                        }`}
                      >
                        {item.icon}
                        {item.name}
                      </Link>
                    ))}
                  </nav>

                  {isAuthenticated && (
                    <>
                      <div className="border-t pt-4">
                        <div className="flex items-center gap-4 mb-4">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={user?.avatarUrl || "/placeholder.svg"} alt={user?.username} />
                            <AvatarFallback>{user?.username?.charAt(0).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium">{user?.name}</p>
                            <p className="text-xs text-muted-foreground">{user?.username}</p>
                          </div>
                        </div>

                        <div className="flex flex-col gap-2">
                          <Link
                            href={`/users/${user?.username}`}
                            className="flex items-center text-sm font-medium transition-colors hover:text-primary"
                          >
                            <User className="mr-2 h-4 w-4" />
                            Profile
                          </Link>
                          <Link
                            href={`/users/${user?.username}?tab=repositories`}
                            className="flex items-center text-sm font-medium transition-colors hover:text-primary"
                          >
                            <GitFork className="mr-2 h-4 w-4" />
                            Repositories
                          </Link>
                          <Link
                            href={`/users/${user?.username}?tab=stars`}
                            className="flex items-center text-sm font-medium transition-colors hover:text-primary"
                          >
                            <Star className="mr-2 h-4 w-4" />
                            Stars
                          </Link>
                          <Button variant="ghost" className="justify-start px-2" onClick={logout}>
                            <LogOut className="mr-2 h-4 w-4" />
                            Log out
                          </Button>
                        </div>
                      </div>
                    </>
                  )}

                  {!isAuthenticated && (
                    <div className="border-t pt-4">
                      <Button asChild className="w-full">
                        <Link href="/login">Sign In</Link>
                      </Button>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          )}
        </div>
      </div>
    </header>
  )
}

import Link from "next/link"
import { GithubIcon } from "lucide-react"

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t bg-background">
      <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0 ml-[40%]">
          <GithubIcon className="h-6 w-6" />
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            &copy; {currentYear} GitHub Clone. All rights reserved.
          </p>
        </div>
        {/* <div className="flex gap-4">
          <Link href="/about" className="text-sm text-muted-foreground hover:underline">
            About
          </Link>
          <Link href="/terms" className="text-sm text-muted-foreground hover:underline">
            Terms
          </Link>
          <Link href="/privacy" className="text-sm text-muted-foreground hover:underline">
            Privacy
          </Link>
          <Link href="/contact" className="text-sm text-muted-foreground hover:underline">
            Contact
          </Link>
        </div> */}
      </div>
    </footer>
  )
}

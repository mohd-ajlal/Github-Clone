
"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { GithubIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function LoginPage() {
  const [isSignedIn, setIsSignedIn] = useState(false);

  const handleSignIn = () => {
    // Simulate sign-in success (replace with actual logic)
    setIsSignedIn(true);
  };

  return (
    <div className="container flex items-center justify-center min-h-[80vh] px-4 py-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">Sign in</CardTitle>
          <CardDescription>Sign in to your account to access all features</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
  {!isSignedIn ? (
    <div className="space-y-2">
      <Link
        href={`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/auth/github`}
        onClick={handleSignIn}
      >
        <Button className="w-full" size="lg">
          <GithubIcon className="mr-2 h-5 w-5" />
          Sign in with GitHub
        </Button>
      </Link>
    </div>
  ) : (
    <div className="text-center text-lg font-bold">Hello</div>
  )}
</CardContent>
        <CardFooter className="flex flex-col">
          <p className="mt-2 text-xs text-center text-gray-500">
            By signing in, you agree to our{" "}
            <Link href="#" className="underline underline-offset-2 hover:text-primary">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="#" className="underline underline-offset-2 hover:text-primary">
              Privacy Policy
            </Link>
            .
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
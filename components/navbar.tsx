"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useSupabase } from "@/lib/supabase-provider"
import { useState, useEffect } from "react"
import { Dumbbell } from "lucide-react"
import { useRouter } from "next/navigation"

export default function Navbar() {
  const pathname = usePathname()
  const { supabase, user } = useSupabase()
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    setIsLoading(false)
  }, [user])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.refresh()
  }

  const isActive = (path: string) => pathname === path

  return (
    <header className="border-b">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Dumbbell className="h-6 w-6" />
          <Link href="/" className="text-xl font-bold">
            Bodybuilding Simulator
          </Link>
        </div>
        <nav className="flex items-center gap-4">
          <Link 
            href="/" 
            className={`text-sm transition-colors hover:text-primary ${
              isActive("/") ? "font-bold underline underline-offset-4" : ""
            }`}
          >
            Home
          </Link>
          <Link 
            href="/advice" 
            className={`text-sm transition-colors hover:text-primary ${
              isActive("/advice") ? "font-bold underline underline-offset-4" : ""
            }`}
          >
            Bodybuilding Advice
          </Link>
          {!isLoading && user && (
            <Link 
              href="/factory" 
              className={`text-sm transition-colors hover:text-primary ${
                isActive("/factory") ? "font-bold underline underline-offset-4" : ""
              }`}
            >
              Protein Factory
            </Link>
          )}
          {!isLoading && (
            <>
              {user ? (
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-cyan-500">
                    <span className="text-sm hidden md:inline">
                      {user.user_metadata?.full_name || user.email?.split("@")[0]}
                    </span>
                  </div>
                  <Button variant="outline" onClick={handleSignOut} size="sm">
                    Sign Out
                  </Button>
                </div>
              ) : (
                <Button asChild size="sm">
                  <Link href="/login">Sign In</Link>
                </Button>
              )}
            </>
          )}
        </nav>
      </div>
    </header>
  )
}

"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { LogIn, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { signOut, useSession } from "@/lib/auth-client"

// Login e opcional: sem sessao mostra "Entrar"; com sessao mostra "Sair".
export function AuthButton() {
  const router = useRouter()
  const { data: session, isPending } = useSession()

  if (isPending) return null

  if (!session) {
    return (
      <Button asChild variant="ghost" size="sm" className="h-10 gap-2">
        <Link href="/login">
          <LogIn className="h-4 w-4" aria-hidden="true" />
          <span className="hidden sm:inline">Entrar</span>
        </Link>
      </Button>
    )
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      className="h-10 gap-2"
      onClick={async () => {
        await signOut()
        router.refresh()
      }}
      aria-label={`Sair da conta ${session.user.email}`}
    >
      <LogOut className="h-4 w-4" aria-hidden="true" />
      <span className="hidden sm:inline">Sair</span>
    </Button>
  )
}

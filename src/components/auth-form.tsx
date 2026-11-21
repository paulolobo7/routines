"use client"

import { useState, type FormEvent } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Coffee } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { signIn, signUp } from "@/lib/auth-client"

interface AuthFormProps {
  mode: "login" | "register"
}

const COPY = {
  login: {
    title: "Entrar",
    description: "Acesse sua conta para sincronizar tarefas e estatisticas.",
    submit: "Entrar",
    alternateText: "Ainda nao tem conta?",
    alternateLabel: "Criar conta",
    alternateHref: "/register",
  },
  register: {
    title: "Criar conta",
    description: "Cadastre-se para guardar suas tarefas e sessoes de foco.",
    submit: "Criar conta",
    alternateText: "Ja tem conta?",
    alternateLabel: "Entrar",
    alternateHref: "/login",
  },
} as const

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter()
  const copy = COPY[mode]
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      const result =
        mode === "register"
          ? await signUp.email({ name, email, password })
          : await signIn.email({ email, password })

      if (result.error) {
        // Mensagem generica no login para nao revelar se o e-mail existe.
        setError(
          mode === "login"
            ? "E-mail ou senha invalidos."
            : result.error.message ?? "Nao foi possivel criar a conta."
        )
        return
      }

      router.push("/")
      router.refresh()
    } catch {
      setError("Nao foi possivel conectar ao servidor. Tente novamente.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10">
      <Card className="w-full max-w-md">
        <CardHeader className="items-center text-center">
          <span className="mb-2 flex h-11 w-11 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Coffee className="h-5 w-5" aria-hidden="true" />
          </span>
          <CardTitle className="text-2xl">{copy.title}</CardTitle>
          <CardDescription>{copy.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {mode === "register" && (
              <div className="flex flex-col gap-2">
                <Label htmlFor="name">Nome</Label>
                <Input
                  id="name"
                  autoComplete="name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            )}
            <div className="flex flex-col gap-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                autoComplete={mode === "login" ? "current-password" : "new-password"}
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {error && (
              <p role="alert" className="text-sm text-destructive">
                {error}
              </p>
            )}

            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Aguarde..." : copy.submit}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              {copy.alternateText}{" "}
              <Link href={copy.alternateHref} className="font-medium text-foreground underline underline-offset-4">
                {copy.alternateLabel}
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </main>
  )
}

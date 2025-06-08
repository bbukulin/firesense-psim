"use client"

import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

export default function Account() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      const res = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (res?.error) {
        setError('Invalid credentials')
        return
      }

      router.push('/dashboard')
      router.refresh()
    } catch {
      setError('An error occurred. Please try again.')
    }
  }

  return (
    <div className="mt-20 flex flex-col items-center justify-center bg-background transition-colors duration-300">
      <Card className="w-full max-w-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl text-center font-semibold">Welcome back</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-destructive/10 text-destructive p-3 rounded text-sm mb-2">
                {error}
              </div>
            )}
            <div className="space-y-6">
              <div className="flex flex-col gap-2">
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="Enter your email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  placeholder="Enter your password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
              </div>
            </div>
            <Button type="submit" className="w-full mt-2 cursor-pointer text-white">Authenticate</Button>
          </form>
        </CardContent>
      </Card>
      <div className="flex flex-row justify-center gap-6 mt-3 w-full max-w-sm">
        <a
          href="#"
          onClick={e => {
            e.preventDefault()
            setEmail('admin@firesense.local')
            setPassword('#jP%9fayxU@6ExY6dG6W#$PWgp$X23zm4u@')
          }}
          className="text-md cursor-pointer text-muted-foreground hover:text-primary transition-colors underline underline-offset-2"
        >
          Admin Demo
        </a>
        <a
          href="#"
          onClick={e => {
            e.preventDefault()
            setEmail('operator@firesense.local')
            setPassword('#jP%9fayxU@6ExY6dG6W#$PWgp$X23zm4u@')
          }}
          className="text-md cursor-pointer text-muted-foreground hover:text-primary transition-colors underline underline-offset-2"
        >
          Operator Demo
        </a>
      </div>
    </div>
  )
} 
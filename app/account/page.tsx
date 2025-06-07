"use client"

import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function Account() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    try {
      const res = await signIn('credentials', {
        email: formData.get('email'),
        password: formData.get('password'),
        redirect: false,
      })

      if (res?.error) {
        setError('Invalid credentials')
        return
      }

      router.push('/dashboard')
      router.refresh()
    } catch (error) {
      setError('An error occurred. Please try again.')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background transition-colors duration-300">
      <div className="max-w-md w-full space-y-8 p-8 bg-card rounded-lg shadow transition-colors duration-300">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-card-foreground font-sans">
            Sign in to FireSense
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-destructive/10 text-destructive p-3 rounded transition-colors duration-300">
              {error}
            </div>
          )}
          <div className="space-y-6">
            <div className="flex flex-col space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-card-foreground mb-1 font-sans">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="appearance-none block w-full px-4 py-3 border border-input placeholder-muted-foreground text-card-foreground bg-background rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-base font-sans transition-colors duration-300 shadow-sm"
                placeholder="Enter your email"
              />
            </div>
            <div className="flex flex-col space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-card-foreground mb-1 font-sans">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none block w-full px-4 py-3 border border-input placeholder-muted-foreground text-card-foreground bg-background rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-base font-sans transition-colors duration-300 shadow-sm"
                placeholder="Enter your password"
              />
            </div>
          </div>
          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-base font-semibold rounded-lg text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary font-sans transition-colors duration-300 shadow-md"
            >
              Sign in
            </button>
          </div>
        </form>
      </div>
    </div>
  )
} 
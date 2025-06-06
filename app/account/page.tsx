"use client"

import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function AccountPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)

    const formData = new FormData(e.currentTarget)
    const username = formData.get("username") as string
    const password = formData.get("password") as string

    try {
      const result = await signIn("credentials", {
        username,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError("Invalid credentials")
        return
      }

      router.push("/dashboard")
    } catch (error) {
      setError("An error occurred. Please try again.")
    }
  }

  return (
    <div className="flex min-h-full flex-1 items-center justify-center px-4 py-12 sm:px-6 lg:px-8 font-['Inter','IBM Plex Sans','Roboto Slab',sans-serif]">
      <div className="w-full max-w-xs space-y-8">
        <div>
          <h2 className="mt-6 text-center text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            Sign in to your account
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <div className="col-span-2">
              <input
                id="username"
                name="username"
                type="text"
                required
                placeholder="Username"
                autoComplete="username"
                aria-label="Username"
                className="block w-full rounded-t-md bg-white dark:bg-[#181A20] px-3 py-2.5 text-base text-gray-900 dark:text-white outline-1 -outline-offset-1 outline-gray-300 dark:outline-gray-700 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:relative focus:outline-2 focus:-outline-offset-2 focus:outline-amber-600 dark:focus:outline-[#b6720d] transition-colors duration-200 dark:focus:border-[#b6720d] dark:hover:border-[#b6720d] sm:text-sm font-medium"
              />
            </div>
            <div className="-mt-px">
              <input
                id="password"
                name="password"
                type="password"
                required
                placeholder="Password"
                autoComplete="current-password"
                aria-label="Password"
                className="block w-full rounded-b-md bg-white dark:bg-[#181A20] px-3 py-2.5 text-base text-gray-900 dark:text-white outline-1 -outline-offset-1 outline-gray-300 dark:outline-gray-700 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:relative focus:outline-2 focus:-outline-offset-2 focus:outline-amber-600 dark:focus:outline-[#b6720d] transition-colors duration-200 dark:focus:border-[#b6720d] dark:hover:border-[#b6720d] sm:text-sm font-medium"
              />
            </div>
          </div>

          {error && (
            <div className="text-sm text-red-600 dark:text-red-400 text-center">
              {error}
            </div>
          )}

          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-amber-600 dark:bg-[#b6720d] px-3 py-2.5 text-sm font-semibold text-white hover:bg-amber-500 dark:hover:bg-[#a05d00] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-600 dark:focus-visible:outline-[#b6720d] transition-colors duration-200"
            >
              Authenticate
            </button>
          </div>
        </form>

        <p className="text-center text-sm text-gray-500 dark:text-gray-400">
          <a href="#" className="font-semibold text-amber-600 dark:text-amber-400 hover:text-amber-500 dark:hover:text-amber-300">
            Demo Account
          </a>
        </p>
      </div>
    </div>
  )
} 
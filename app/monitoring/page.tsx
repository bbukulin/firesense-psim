"use server"

import { getCameras } from "@/app/admin/_actions/cameras"
import Link from "next/link"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import MonitoringPageClient from "./_components/monitoring-page-client"

interface MonitoringPageProps {
  searchParams: { 
    error?: string
    type?: string
    severity?: string
  }
}

export default async function MonitoringPage({ searchParams }: MonitoringPageProps) {
  const cameras = await getCameras()

  return (
    <div className="container mx-auto px-4 py-4 sm:py-6 md:py-8">
      
      {searchParams.error === "simulation_failed" && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to simulate incident. Please try again.
          </AlertDescription>
        </Alert>
      )}

      <MonitoringPageClient cameras={cameras} />
    </div>
  )
} 
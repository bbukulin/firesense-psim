"use server"

import { getCameras } from "@/app/admin/_actions/cameras"
import { Card, CardContent } from "@/components/ui/card"
import MonitoringClientPage from "./_components/monitoring-client-page"

export default async function MonitoringPage() {
  const cameras = await getCameras()

  return (
    <div className="container mx-auto px-4 py-4 sm:py-6 md:py-8">
      <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">Monitoring</h1>
      <Card>
        <CardContent>
          <MonitoringClientPage cameras={cameras} />
        </CardContent>
      </Card>
    </div>
  )
} 
"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getLatestSensorReadingsAction } from "../_actions/sensor-actions"
import { useEffect, useState } from "react"
import { Skeleton } from "@/components/ui/skeleton"

// Add a subtle blink animation
const blinkClass =
  "inline-block w-2 h-2 rounded-full mr-2 align-middle animate-pulse"

// Format date/time for 'Last updated at'
function formatDateTime(date: Date) {
  const d = new Date(date)
  const day = d.getDate()
  const month = d.getMonth() + 1
  const year = d.getFullYear()
  const hours = d.getHours().toString().padStart(2, '0')
  const minutes = d.getMinutes().toString().padStart(2, '0')
  const seconds = d.getSeconds().toString().padStart(2, '0')
  return `${day}.${month}.${year}., ${hours}:${minutes}:${seconds}`
}

type SensorWithLatestReading = {
  id: number
  name: string
  type: string
  location: string | null
  value: string
  smoke_detected: boolean | null
  timestamp: Date
  active?: boolean // for blinking dot
}

export default function SensorStatus() {
  const [sensors, setSensors] = useState<SensorWithLatestReading[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSensors = async () => {
      try {
        const result = await getLatestSensorReadingsAction()
        if (result.isSuccess) {
          setSensors(result.data)
        } else {
          setError(result.message)
        }
      } finally {
        setLoading(false)
      }
    }

    fetchSensors()
    // Refresh every 30 seconds
    const interval = setInterval(fetchSensors, 30000)
    return () => clearInterval(interval)
  }, [])

  if (error) {
    return <div className="text-red-500">Error: {error}</div>
  }

  // Group sensors by type
  const temperatureSensors = sensors.filter((s) => s.type === "temperature")
  const smokeSensors = sensors.filter((s) => s.type === "smoke")
  const gasSensors = sensors.filter((s) => s.type === "gas")

  // Helper to get last updated time for a group
  const getLastUpdated = (group: SensorWithLatestReading[]) => {
    if (!group.length) return null
    const latest = group.reduce((a, b) =>
      new Date(a.timestamp) > new Date(b.timestamp) ? a : b
    )
    return latest.timestamp
  }

  const SensorSkeleton = () => (
    <div className="space-y-2">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex justify-between items-center">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-16" />
        </div>
      ))}
      <Skeleton className="h-3 w-32 mt-4" />
    </div>
  )

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <Card>
        <CardHeader>
          <CardTitle>Temperature Sensors</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <SensorSkeleton />
          ) : (
            <>
              <div className="space-y-2">
                {temperatureSensors.map((sensor) => (
                  <div key={sensor.id} className="flex justify-between items-center">
                    <span className="flex items-center text-sm text-muted-foreground">
                      <span
                        className={
                          blinkClass +
                          (sensor.active !== false
                            ? " bg-green-500"
                            : " bg-red-500")
                        }
                        aria-label={sensor.active !== false ? "Active" : "Inactive"}
                      />
                      {sensor.location || sensor.name}
                    </span>
                    <span className="font-medium">{parseFloat(sensor.value).toFixed(1)}°C</span>
                  </div>
                ))}
              </div>
              {temperatureSensors.length > 0 && (
                <div className="mt-4 text-xs text-muted-foreground">
                  Last updated at: {formatDateTime(getLastUpdated(temperatureSensors)!)}
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Smoke Detectors</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <SensorSkeleton />
          ) : (
            <>
              <div className="space-y-2">
                {smokeSensors.map((sensor) => (
                  <div key={sensor.id} className="flex justify-between items-center">
                    <span className="flex items-center text-sm text-muted-foreground">
                      <span
                        className={
                          blinkClass +
                          (sensor.active !== false
                            ? " bg-green-500"
                            : " bg-red-500")
                        }
                        aria-label={sensor.active !== false ? "Active" : "Inactive"}
                      />
                      {sensor.location || sensor.name}
                    </span>
                    <span
                      className={`font-medium ${
                        sensor.smoke_detected ? "text-red-500" : "text-muted-foreground"
                      }`}
                    >
                      {sensor.smoke_detected ? "Detected" : "Normal"}
                    </span>
                  </div>
                ))}
              </div>
              {smokeSensors.length > 0 && (
                <div className="mt-4 text-xs text-muted-foreground">
                  Last updated at: {formatDateTime(getLastUpdated(smokeSensors)!)}
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Gas Sensors</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <SensorSkeleton />
          ) : (
            <>
              <div className="space-y-2">
                {gasSensors.map((sensor) => (
                  <div key={sensor.id} className="flex justify-between items-center">
                    <span className="flex items-center text-sm text-muted-foreground">
                      <span
                        className={
                          blinkClass +
                          (sensor.active !== false
                            ? " bg-green-500"
                            : " bg-red-500")
                        }
                        aria-label={sensor.active !== false ? "Active" : "Inactive"}
                      />
                      {sensor.location || sensor.name}
                    </span>
                    <span className="font-medium">{parseFloat(sensor.value).toFixed(0)} ppm</span>
                  </div>
                ))}
              </div>
              {gasSensors.length > 0 && (
                <div className="mt-4 text-xs text-muted-foreground">
                  Last updated at: {formatDateTime(getLastUpdated(gasSensors)!)}
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Cameras Card */}
      <Card>
        <CardContent className="flex flex-col p-6 pt-0 pb-0">
          {loading ? (
            <>
              <div className="flex flex-row justify-between w-full">
                <div className="flex flex-col items-start flex-1 py-1">
                  <Skeleton className="h-5 w-24 mb-2" />
                  <Skeleton className="h-7 w-12 mb-1" />
                  <Skeleton className="h-4 w-32" />
                </div>
                <div className="w-px bg-muted mx-6 h-16 self-center" />
                <div className="flex flex-col items-start justify-center flex-1 py-1">
                  <Skeleton className="h-5 w-24 mb-2" />
                  <Skeleton className="h-7 w-12 mb-1" />
                  <Skeleton className="h-4 w-32" />
                </div>
              </div>
              <div className="w-full h-px bg-muted my-4" />
              <div className="flex flex-col gap-1 w-full">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
              </div>
            </>
          ) : (
            <>
              {/* Top row: Cameras and Operators */}
              <div className="flex flex-row justify-between w-full">
                {/* Left: Cameras Info */}
                <div className="flex flex-col items-start flex-1 py-1">
                  <div className="flex items-center gap-2 mb-1">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-blue-400 lucide lucide-cctv-icon lucide-cctv" aria-label="Cameras">
                      <path d="M16.75 12h3.632a1 1 0 0 1 .894 1.447l-2.034 4.069a1 1 0 0 1-1.708.134l-2.124-2.97" />
                      <path d="M17.106 9.053a1 1 0 0 1 .447 1.341l-3.106 6.211a1 1 0 0 1-1.342.447L3.61 12.3a2.92 2.92 0 0 1-1.3-3.91L3.69 5.6a2.92 2.92 0 0 1 3.92-1.3z" />
                      <path d="M2 19h3.76a2 2 0 0 0 1.8-1.1L9 15" />
                      <path d="M2 21v-4" />
                      <path d="M7 9h.01" />
                    </svg>
                    <span className="text-base font-semibold">Cameras</span>
                  </div>
                  <div className="text-xl font-semibold mb-1">12</div>
                  <div className="text-sm text-muted-foreground">Active Cameras</div>
                </div>

                {/* Vertical Separator */}
                <div className="w-px bg-muted mx-6 h-16 self-center" />

                {/* Right: Operators Info */}
                <div className="flex flex-col items-start justify-center flex-1 py-1">
                  <div className="flex items-center gap-2 mb-1">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-blue-400 lucide lucide-user-icon lucide-user" aria-label="Operators">
                      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                    <span className="text-base font-semibold">Operators</span>
                  </div>
                  <div className="text-xl font-semibold mb-1">3</div>
                  <div className="text-sm text-muted-foreground">Active Operators</div>
                </div>
              </div>

              {/* Separator */}
              <div className="w-full h-px bg-muted my-4" />

              {/* Additional Info */}
              <div className="flex flex-col gap-1 w-full">
                <div className="flex justify-between w-full">
                  <span className="text-sm text-muted-foreground">Hours since last incident</span>
                  <span className="text-sm text-muted-foreground">--</span>
                </div>
                <div className="flex justify-between w-full">
                  <span className="text-sm text-muted-foreground">Days since last incident</span>
                  <span className="text-sm text-muted-foreground">--</span>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 
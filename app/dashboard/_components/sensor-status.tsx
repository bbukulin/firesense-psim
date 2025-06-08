"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getLatestSensorReadingsAction } from "../_actions/sensor-actions"
import { useEffect, useState } from "react"

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

  useEffect(() => {
    const fetchSensors = async () => {
      const result = await getLatestSensorReadingsAction()
      if (result.isSuccess) {
        setSensors(result.data)
      } else {
        setError(result.message)
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

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle>Temperature Sensors</CardTitle>
        </CardHeader>
        <CardContent>
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
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Smoke Detectors</CardTitle>
        </CardHeader>
        <CardContent>
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
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Gas Sensors</CardTitle>
        </CardHeader>
        <CardContent>
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
        </CardContent>
      </Card>
    </div>
  )
} 
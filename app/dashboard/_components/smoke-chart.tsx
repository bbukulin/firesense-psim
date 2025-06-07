"use client"

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts"
import { useEffect, useState } from "react"
import { getSmokeReadingsAction } from "../_actions/sensor-actions"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"

type SmokeReading = {
  time: string
  value: number
  smoke_detected: boolean | null
  sensorName: string
  location: string | null
}

function getSensorLabel(reading: SmokeReading) {
  return reading.location && reading.location.trim().length > 0 ? reading.location : reading.sensorName
}

export default function SmokeChart() {
  const [readings, setReadings] = useState<SmokeReading[]>([])
  const [error, setError] = useState<string | null>(null)
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null)

  useEffect(() => {
    const fetchReadings = async () => {
      const result = await getSmokeReadingsAction()
      if (result.isSuccess && result.data) {
        setReadings(result.data)
        if (!selectedLocation && result.data.length > 0) {
          // Default to first location label
          setSelectedLocation(getSensorLabel(result.data[0]))
        }
      } else {
        setError(result.message || 'Failed to fetch smoke readings')
      }
    }
    fetchReadings()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (error) {
    return <div className="text-red-500">Error: {error}</div>
  }

  // Get unique location labels
  const locationLabels = Array.from(new Set(readings.map(getSensorLabel)))

  // Filter readings for the selected location label
  const filteredReadings = readings.filter(r => getSensorLabel(r) === selectedLocation)
  // Show only the latest 30 readings
  const displayedReadings = filteredReadings.slice(0, 20)

  return (
    <div className="w-full h-72 flex flex-col gap-2">
      <div className="flex items-center justify-between mb-2 w-full">
        <h2 className="text-lg font-medium">Smoke Detection Trend</h2>
        <Select value={selectedLocation ?? undefined} onValueChange={setSelectedLocation}>
          <SelectTrigger className="min-w-[8rem] w-auto">
            <SelectValue placeholder="Select location" />
          </SelectTrigger>
          <SelectContent>
            {locationLabels.map(label => (
              <SelectItem key={label} value={label}>{label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="w-full h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={displayedReadings} margin={{ top: 16, right: 24, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
            <XAxis 
              dataKey="time" 
              stroke="#888" 
              fontSize={12}
              tickFormatter={(time) => time.split(":").slice(0, 2).join(":")}
            />
            <YAxis 
              stroke="#888" 
              fontSize={12} 
              domain={[0, 1]} 
              ticks={[0, 1]}
              tickFormatter={(value) => value === 1 ? "Detected" : "Normal"}
            />
            <Tooltip 
              formatter={(value: number) => [value === 1 ? "Detected" : "Normal", "Status"]}
              labelFormatter={(time) => `Time: ${time}`}
            />
            <Bar 
              dataKey="value" 
              fill="#f87171" 
              fillOpacity={0.8}
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
} 
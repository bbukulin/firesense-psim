"use client"

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, AreaChart, Area } from "recharts"
import { useEffect, useState } from "react"
import { getTemperatureReadingsAction } from "../_actions/sensor-actions"
import { Select } from "@/components/ui/select"
import { SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"

type TemperatureReading = {
  time: string
  value: number
  sensorName: string
  location: string | null
}

function getSensorLabel(reading: TemperatureReading) {
  return reading.location && reading.location.trim().length > 0 ? reading.location : reading.sensorName
}

export default function TemperatureChart() {
  const [readings, setReadings] = useState<TemperatureReading[]>([])
  const [error, setError] = useState<string | null>(null)
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchReadings = async () => {
      try {
        const result = await getTemperatureReadingsAction()
        if (result.isSuccess && result.data) {
          setReadings(result.data)
          if (!selectedLocation && result.data.length > 0) {
            // Default to first location label
            setSelectedLocation(getSensorLabel(result.data[0]))
          }
        } else {
          setError(result.message || 'Failed to fetch temperature readings')
        }
      } finally {
        setLoading(false)
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

  return (
    <div className="w-full h-72 flex flex-col gap-2">
      <div className="flex items-center justify-between mb-2 w-full">
        <h2 className="text-lg font-medium">Temperature Trend</h2>
        {loading ? (
          <Skeleton className="h-10 w-32" />
        ) : (
          <Select value={selectedLocation ?? undefined} onValueChange={setSelectedLocation}>
            <SelectTrigger className="min-w-[8rem] w-auto cursor-pointer">
              <SelectValue placeholder="Select location" />
            </SelectTrigger>
            <SelectContent>
              {locationLabels.map(label => (
                <SelectItem key={label} value={label}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>
      <div className="w-full h-64">
        {loading ? (
          <Skeleton className="w-full h-full" />
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={filteredReadings} margin={{ top: 16, right: 24, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#60a5fa" stopOpacity={0.1} />
                </linearGradient>
              </defs>
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
                unit="°C"
                tickFormatter={(value) => value.toFixed(1)}
              />
              <Tooltip 
                formatter={(value: number) => [`${value.toFixed(1)}°C`, 'Temperature']}
                labelFormatter={(time) => `Time: ${time}`}
              />
              <Area
                type="monotone"
                dataKey="value"
                name={selectedLocation ?? ''}
                stroke="#60a5fa"
                fill="url(#tempGradient)"
                fillOpacity={1}
                dot={false}
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  )
} 
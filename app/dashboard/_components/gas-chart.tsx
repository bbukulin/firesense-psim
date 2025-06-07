"use client"

import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts"
import { useEffect, useState } from "react"
import { getGasReadingsAction } from "../_actions/sensor-actions"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"

type GasReading = {
  time: string
  value: number
  sensorName: string
  location: string | null
}

function getSensorLabel(reading: GasReading) {
  return reading.location && reading.location.trim().length > 0 ? reading.location : reading.sensorName
}

export default function GasChart() {
  const [readings, setReadings] = useState<GasReading[]>([])
  const [error, setError] = useState<string | null>(null)
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null)

  useEffect(() => {
    const fetchReadings = async () => {
      const result = await getGasReadingsAction()
      if (result.isSuccess && result.data) {
        setReadings(result.data)
        if (!selectedLocation && result.data.length > 0) {
          // Default to first location label
          setSelectedLocation(getSensorLabel(result.data[0]))
        }
      } else {
        setError(result.message || 'Failed to fetch gas readings')
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
        <h2 className="text-lg font-medium">Gas Levels Trend</h2>
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
          <AreaChart data={filteredReadings} margin={{ top: 16, right: 24, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="gasGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#34d399" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#34d399" stopOpacity={0.1} />
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
              unit="ppm"
              tickFormatter={(value) => value.toFixed(0)}
            />
            <Tooltip 
              formatter={(value: number) => [`${value.toFixed(0)} ppm`, 'Gas Level']}
              labelFormatter={(time) => `Time: ${time}`}
            />
            <Area
              type="monotone"
              dataKey="value"
              name={selectedLocation ?? ''}
              stroke="#34d399"
              fill="url(#gasGradient)"
              fillOpacity={1}
              dot={false}
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
} 
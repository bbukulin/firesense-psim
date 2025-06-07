"use client"

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts"

const sampleData = [
  { time: "10:00", value: 22 },
  { time: "10:05", value: 23 },
  { time: "10:10", value: 24 },
  { time: "10:15", value: 25 },
  { time: "10:20", value: 24 },
  { time: "10:25", value: 26 },
  { time: "10:30", value: 27 },
]

export default function TemperatureChart() {
  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={sampleData} margin={{ top: 16, right: 24, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#333" />
          <XAxis dataKey="time" stroke="#888" fontSize={12} />
          <YAxis stroke="#888" fontSize={12} unit="°C" />
          <Tooltip />
          <Line type="monotone" dataKey="value" stroke="#60a5fa" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
} 
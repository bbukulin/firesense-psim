"use client"

import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts"

const sampleData = [
  { time: "10:00", value: 0 },
  { time: "10:05", value: 0 },
  { time: "10:10", value: 1 },
  { time: "10:15", value: 1 },
  { time: "10:20", value: 0 },
  { time: "10:25", value: 0 },
  { time: "10:30", value: 0 },
]

export default function SmokeChart() {
  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={sampleData} margin={{ top: 16, right: 24, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#333" />
          <XAxis dataKey="time" stroke="#888" fontSize={12} />
          <YAxis stroke="#888" fontSize={12} domain={[0, 1]} ticks={[0, 1]} />
          <Tooltip formatter={(value) => (value === 1 ? "Detected" : "Normal")} />
          <Area type="monotone" dataKey="value" stroke="#f87171" fill="#f87171" fillOpacity={0.3} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
} 
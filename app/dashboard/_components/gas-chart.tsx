"use client"

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts"

const sampleData = [
  { time: "10:00", value: 320 },
  { time: "10:05", value: 340 },
  { time: "10:10", value: 350 },
  { time: "10:15", value: 355 },
  { time: "10:20", value: 345 },
  { time: "10:25", value: 330 },
  { time: "10:30", value: 325 },
]

export default function GasChart() {
  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={sampleData} margin={{ top: 16, right: 24, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#333" />
          <XAxis dataKey="time" stroke="#888" fontSize={12} />
          <YAxis stroke="#888" fontSize={12} unit="ppm" />
          <Tooltip />
          <Line type="monotone" dataKey="value" stroke="#34d399" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
} 
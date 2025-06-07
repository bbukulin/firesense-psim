"use client"

import { Camera } from "@/db/schema/cameras-schema"
import { CameraFeed } from "./camera-feed"

interface CameraGridProps {
  cameras: Camera[]
}

export function CameraGrid({ cameras }: CameraGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {cameras.map((camera) => (
        <CameraFeed
          key={camera.id}
          name={camera.name}
          location={camera.location}
          streamUrl={camera.streamUrl}
          isActive={camera.active}
        />
      ))}
    </div>
  )
} 
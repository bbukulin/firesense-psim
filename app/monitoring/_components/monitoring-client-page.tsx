"use client"

import { useState } from "react"
import { Camera } from "@/db/schema/cameras-schema"
import { CameraGrid } from "./camera-grid"
import { Button } from "@/components/ui/button"
import { LayoutGrid, Focus } from "lucide-react"
// @ts-expect-error - SpotlightLayout component is not typed
import { SpotlightLayout } from "./spotlight-layout"

interface MonitoringClientPageProps {
  cameras: Camera[]
}

export default function MonitoringClientPage({ cameras }: MonitoringClientPageProps) {
  const [viewMode, setViewMode] = useState<"grid" | "spotlight">("grid")
  const [spotlightCameraId, setSpotlightCameraId] = useState<string>(cameras[0]?.id || "")

  const handleChangeSpotlight = (id: string) => {
    setSpotlightCameraId(id)
  }

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg sm:text-xl font-semibold">Camera Feeds</h2>
        <div className="flex gap-2">
          <Button
            size="icon"
            variant={viewMode === "grid" ? "secondary" : "ghost"}
            aria-label="Grid view"
            className="bg-muted text-primary"
            onClick={() => setViewMode("grid")}
          >
            <LayoutGrid className="w-5 h-5" />
          </Button>
          <Button
            size="icon"
            variant={viewMode === "spotlight" ? "secondary" : "ghost"}
            aria-label="Spotlight view"
            onClick={() => setViewMode("spotlight")}
          >
            <Focus className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {viewMode === "grid" ? (
        <CameraGrid cameras={cameras} />
      ) : (
        <SpotlightLayout
          cameras={cameras}
          spotlightCameraId={spotlightCameraId}
          onChangeSpotlight={handleChangeSpotlight}
        />
      )}
    </>
  )
} 
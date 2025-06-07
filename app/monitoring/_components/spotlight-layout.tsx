"use client"

import { Camera } from "@/db/schema/cameras-schema"
import { CameraFeed } from "./camera-feed"
import { motion, AnimatePresence } from "framer-motion"

interface SpotlightLayoutProps {
  cameras: Camera[]
  spotlightCameraId: string
  onChangeSpotlight: (id: string) => void
}

export function SpotlightLayout({ cameras, spotlightCameraId, onChangeSpotlight }: SpotlightLayoutProps) {
  const spotlightCamera = cameras.find((c) => c.id === spotlightCameraId) || cameras[0]
  const restCameras = cameras.filter((c) => c.id !== spotlightCamera.id)

  return (
    <div className="flex flex-col md:flex-row gap-4 min-h-[350px]">
      {/* Spotlight camera */}
      <AnimatePresence mode="wait">
        <motion.div
          key={spotlightCamera.id}
          layout
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="flex-1 min-w-0"
          style={{ flexBasis: "75%" }}
        >
          <CameraFeed
            name={spotlightCamera.name}
            location={spotlightCamera.location}
            streamUrl={spotlightCamera.streamUrl}
            isActive={spotlightCamera.active}
          />
        </motion.div>
      </AnimatePresence>

      {/* Rest of cameras stacked on the right */}
      <div className="flex flex-row md:flex-col gap-4 md:w-1/4 min-w-[180px]">
        {restCameras.map((camera) => (
          <motion.div
            key={camera.id}
            layout
            whileHover={{ scale: 1.04 }}
            className="cursor-pointer"
            onClick={() => onChangeSpotlight(camera.id)}
          >
            <CameraFeed
              name={camera.name}
              location={camera.location}
              streamUrl={camera.streamUrl}
              isActive={camera.active}
            />
          </motion.div>
        ))}
      </div>
    </div>
  )
} 
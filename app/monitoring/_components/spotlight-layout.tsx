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
    <div className="flex flex-col gap-6">
      {/* Spotlight camera at the top, full width */}
      <AnimatePresence mode="wait">
        <motion.div
          key={spotlightCamera.id}
          layout
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="w-full"
        >
          <CameraFeed
            name={spotlightCamera.name}
            location={spotlightCamera.location}
            streamUrl={spotlightCamera.streamUrl}
            isActive={spotlightCamera.active}
          />
        </motion.div>
      </AnimatePresence>

      {/* Rest of cameras in a responsive grid below */}
      {restCameras.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
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
      )}
    </div>
  )
} 
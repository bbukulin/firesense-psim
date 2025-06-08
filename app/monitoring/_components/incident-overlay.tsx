"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"

interface IncidentOverlayProps {
  isOpen: boolean
  onClose: () => void
  incidentType: string
  severity: number
}

export function IncidentOverlay({ isOpen, onClose, incidentType, severity }: IncidentOverlayProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-red-950/95 flex items-center justify-center"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="text-center space-y-6 p-8"
          >
            <motion.div
              initial={{ y: -20 }}
              animate={{ y: 0 }}
              className="flex justify-center"
            >
              <AlertTriangle className="w-24 h-24 text-red-500" />
            </motion.div>
            
            <div className="space-y-2">
              <h2 className="text-4xl font-bold text-white">
                {incidentType.charAt(0).toUpperCase() + incidentType.slice(1)} Alert
              </h2>
              <p className="text-red-200 text-lg">
                Severity Level: {severity}
              </p>
              <p className="text-red-200/80">
                Simulated incident for demonstration purposes
              </p>
            </div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Button
                size="lg"
                className="bg-white text-red-950 hover:bg-red-100"
                onClick={onClose}
              >
                Acknowledge Incident
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
} 
import { db } from "../index"
import { sensorReadings, sensors } from "../../db/schema/sensors-schema"
import { eq } from "drizzle-orm"

export async function seedSensorReadings() {
  console.log("🌱 Seeding sensor readings...")

  try {
    // Get all sensors first
    const allSensors = await db.select().from(sensors)
    
    if (allSensors.length === 0) {
      console.log("⚠️ No sensors found. Please seed sensors first.")
      return
    }

    const readings: typeof sensorReadings.$inferInsert[] = []

    // Generate readings for each sensor
    for (const sensor of allSensors) {
      // Generate 24 hours of readings (one per hour)
      for (let i = 0; i < 24; i++) {
        const timestamp = new Date()
        timestamp.setHours(timestamp.getHours() - i) // Go back i hours

        let value: number
        let smokeDetected: boolean | null = null

        // Generate appropriate values based on sensor type
        switch (sensor.type) {
          case "temperature":
            // Temperature between 15-35°C with some randomness
            value = 25 + (Math.random() * 10 - 5)
            break
          case "smoke":
            // Smoke level between 0-100 with occasional spikes
            value = Math.random() * 100
            smokeDetected = value > 50 // Smoke detected if value > 50
            break
          case "gas":
            // Gas level between 0-500 ppm with some randomness
            value = 200 + (Math.random() * 300)
            break
          default:
            value = Math.random() * 100
        }

        readings.push({
          sensor_id: sensor.id,
          timestamp,
          value: value.toString(),
          smoke_detected: smokeDetected,
          metadata: JSON.stringify({
            battery_level: Math.floor(Math.random() * 100),
            signal_strength: Math.floor(Math.random() * 5) + 1
          })
        })
      }
    }

    // Insert all readings
    await db.insert(sensorReadings).values(readings)
    
    console.log(`✅ Successfully seeded ${readings.length} sensor readings`)
  } catch (error) {
    console.error("❌ Error seeding sensor readings:", error)
    throw error
  }
} 
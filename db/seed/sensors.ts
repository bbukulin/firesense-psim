import { db } from "../index"
import { sensors } from "../schema/sensors-schema"
import { sensorTypeEnum } from "../schema/sensors-schema"

async function seedSensors() {
  console.log("🌱 Seeding sensors...")

  // Check if sensors table already has data
  const existing = await db.select().from(sensors).limit(1)
  if (existing.length > 0) {
    console.log("⚠️ Sensors table already seeded. Skipping.")
    return
  }

  const sensorData = [
    // Temperature Sensors
    {
      name: "Server Room Temp Sensor 1",
      type: sensorTypeEnum.TEMPERATURE,
      location: "Server Room A",
      description: "Primary temperature sensor monitoring server rack temperatures",
      active: true
    },
    {
      name: "Server Room Temp Sensor 2",
      type: sensorTypeEnum.TEMPERATURE,
      location: "Server Room B",
      description: "Backup temperature sensor for redundancy",
      active: true
    },
    {
      name: "Office Area Temp Sensor",
      type: sensorTypeEnum.TEMPERATURE,
      location: "Main Office",
      description: "General office area temperature monitoring",
      active: true
    },

    // Smoke Sensors
    {
      name: "Server Room Smoke Detector 1",
      type: sensorTypeEnum.SMOKE,
      location: "Server Room A",
      description: "Primary smoke detection in server room",
      active: true
    },
    {
      name: "Office Smoke Detector",
      type: sensorTypeEnum.SMOKE,
      location: "Main Office",
      description: "Smoke detection for office area",
      active: true
    },
    {
      name: "Storage Room Smoke Detector",
      type: sensorTypeEnum.SMOKE,
      location: "Storage Room",
      description: "Smoke detection for storage area",
      active: true
    },

    // Gas Sensors
    {
      name: "Server Room CO2 Monitor",
      type: sensorTypeEnum.GAS,
      location: "Server Room A",
      description: "CO2 level monitoring in server room",
      active: true
    },
    {
      name: "Office CO2 Monitor",
      type: sensorTypeEnum.GAS,
      location: "Main Office",
      description: "CO2 level monitoring in office area",
      active: true
    },
    {
      name: "Storage Room Gas Detector",
      type: sensorTypeEnum.GAS,
      location: "Storage Room",
      description: "General gas detection in storage area",
      active: true
    }
  ]

  try {
    // Insert all sensors
    await db.insert(sensors).values(sensorData)
    console.log("✅ Sensors seeded successfully")
  } catch (error) {
    console.error("❌ Error seeding sensors:", error)
    throw error
  }
}

// Export the seed function
export { seedSensors } 
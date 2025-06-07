import { seedUsers } from "./users"
import { seedSensors } from "./sensors"
import { seedSensorReadings } from "./sensor-readings"

async function seed() {
  console.log("🌱 Starting database seeding...")

  try {
    // Run all seed functions
    await seedUsers()
    await seedSensors()
    await seedSensorReadings()
    
    console.log("✅ Database seeding completed successfully")
    process.exit(0)
  } catch (error) {
    console.error("❌ Error seeding database:", error)
    process.exit(1)
  }
}

// Run the seed function
seed() 
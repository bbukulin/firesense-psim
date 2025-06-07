import { db } from "../index"
import { cameras } from "../schema/cameras-schema"
import { users } from "../schema/users-schema"
import { eq } from "drizzle-orm"

export async function seedCameras() {
  console.log("📸 Seeding cameras...")

  // Check if cameras already exist
  const existingCameras = await db.select().from(cameras)
  if (existingCameras.length > 0) {
    console.log("📸 Cameras already exist, skipping...")
    return
  }

  // Get admin user ID for createdBy field
  const adminUser = await db.select().from(users).where(eq(users.role, "admin")).limit(1)
  if (!adminUser.length) {
    throw new Error("No admin user found for camera seeding")
  }
  const adminId = adminUser[0].id

  // Sample camera data
  const cameraData = [
    {
      name: "Main Entrance",
      location: "Building A - Front Door",
      streamUrl: "https://example.com/streams/main-entrance",
      active: true,
      createdBy: adminId,
    },
    {
      name: "Server Room",
      location: "Building B - Level 1",
      streamUrl: "https://example.com/streams/server-room",
      active: true,
      createdBy: adminId,
    },
    {
      name: "Parking Lot",
      location: "Building A - Ground Level",
      streamUrl: "https://example.com/streams/parking-lot",
      active: true,
      createdBy: adminId,
    },
    {
      name: "Loading Dock",
      location: "Building B - Back Entrance",
      streamUrl: "https://example.com/streams/loading-dock",
      active: true,
      createdBy: adminId,
    },
    {
      name: "Lobby",
      location: "Building A - Ground Floor",
      streamUrl: "https://example.com/streams/lobby",
      active: true,
      createdBy: adminId,
    },
    {
      name: "Emergency Exit",
      location: "Building B - Side Entrance",
      streamUrl: "https://example.com/streams/emergency-exit",
      active: true,
      createdBy: adminId,
    },
  ]

  // Insert cameras
  await db.insert(cameras).values(cameraData)
  console.log("✅ Cameras seeded successfully")
} 
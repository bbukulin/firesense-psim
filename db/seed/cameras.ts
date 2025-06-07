import { db } from "../index"
import { cameras } from "../schema/cameras-schema"
import { users } from "../schema/users-schema"
import { eq } from "drizzle-orm"

export async function seedCameras() {
  console.log("📸 Seeding cameras...")

  //Check if cameras already exist
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

  // Sample camera data with HLS streams
  const cameraData = [
    {
      name: "Main Entrance",
      location: "Building A - Front Door",
      streamUrl: "https://example.com/streams/main-entrance",
      active: true,
      createdBy: adminId,
    },
    {
      name: "fMP4 Stream",
      location: "Demo Stream 2",
      streamUrl: "https://devstreaming-cdn.apple.com/videos/streaming/examples/img_bipbop_adv_example_fmp4/master.m3u8",
      active: true,
      createdBy: adminId,
    },
    {
      name: "MP4 Stream",
      location: "Demo Stream 3",
      streamUrl: "https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.mp4/.m3u8",
      active: true,
      createdBy: adminId,
    },
    {
      name: "Live Akamai 1",
      location: "Demo Stream 4",
      streamUrl: "https://cph-p2p-msl.akamaized.net/hls/live/2000341/test/master.m3u8",
      active: true,
      createdBy: adminId,
    },
    {
      name: "Live Akamai 2",
      location: "Demo Stream 5",
      streamUrl: "https://moctobpltc-i.akamaihd.net/hls/live/571329/eight/playlist.m3u8",
      active: true,
      createdBy: adminId,
    },
    {
      name: "Dolby VOD",
      location: "Demo Stream 6",
      streamUrl: "http://d3rlna7iyyu8wu.cloudfront.net/skip_armstrong/skip_armstrong_stereo_subs.m3u8",
      active: true,
      createdBy: adminId,
    },
  ]

  // Insert cameras
  await db.insert(cameras).values(cameraData)
  console.log("✅ Cameras seeded successfully")
} 
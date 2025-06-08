"use server"

import { db } from "@/db"
import { cameras } from "@/db/schema/cameras-schema"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { NewCamera } from "@/db/schema/cameras-schema"
import { eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"

export async function getCameras() {
  const session = await getServerSession(authOptions)
  if (!session || !["admin", "operator"].includes(session.user.role)) {
    throw new Error("Unauthorized")
  }

  return await db.select().from(cameras)
}

export async function addCamera(data: Omit<NewCamera, "id" | "createdAt" | "createdBy">) {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== "admin") {
    throw new Error("Unauthorized")
  }

  const [camera] = await db
    .insert(cameras)
    .values({
      ...data,
      createdBy: session.user.id,
    })
    .returning()

  revalidatePath("/admin")
  return camera
}

export async function updateCamera(id: string, data: Partial<Omit<NewCamera, "id" | "createdAt" | "createdBy">>) {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== "admin") {
    throw new Error("Unauthorized")
  }

  const [camera] = await db
    .update(cameras)
    .set(data)
    .where(eq(cameras.id, id))
    .returning()

  revalidatePath("/admin")
  return camera
}

export async function deleteCamera(id: string) {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== "admin") {
    throw new Error("Unauthorized")
  }

  await db.delete(cameras).where(eq(cameras.id, id))
  revalidatePath("/admin")
} 
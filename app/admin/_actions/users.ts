"use server"

import { db } from "@/db"
import { users } from "@/db/schema/users-schema"
import { desc, eq } from "drizzle-orm"
import { hash } from "bcryptjs"

export async function getUsers() {
  try {
    const data = await db.select().from(users).orderBy(desc(users.createdAt))
    return { data }
  } catch (error) {
    return { error: "Failed to fetch users" }
  }
}

export async function createUser(formData: FormData) {
  try {
    const email = formData.get("email") as string
    const username = formData.get("username") as string
    const password = formData.get("password") as string
    const role = formData.get("role") as "admin" | "operator"

    // Check if user already exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1)

    if (existingUser.length > 0) {
      return { error: "User with this email already exists" }
    }

    const hashedPassword = await hash(password, 10)

    await db.insert(users).values({
      email,
      username,
      passwordHash: hashedPassword,
      role,
    })

    return { success: true }
  } catch (error) {
    return { error: "Failed to create user" }
  }
}

export async function updateUser(formData: FormData) {
  try {
    const id = formData.get("id") as string
    const email = formData.get("email") as string
    const username = formData.get("username") as string
    const role = formData.get("role") as "admin" | "operator"
    const password = formData.get("password") as string

    // Check if email is taken by another user
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1)

    if (existingUser.length > 0 && existingUser[0].id !== id) {
      return { error: "User with this email already exists" }
    }

    // Prevent demoting the last admin
    if (role === "operator") {
      // Check if this user is an admin and if they are the last admin
      const targetUser = await db.select().from(users).where(eq(users.id, id)).limit(1)
      if (targetUser[0]?.role === "admin") {
        const adminCount = await db
          .select()
          .from(users)
          .where(eq(users.role, "admin"))
        if (adminCount.length === 1) {
          return { error: "Cannot change role. At least one admin must remain in the system." }
        }
      }
    }

    const updateData: any = {
      email,
      username,
      role,
    }

    // Only update password if provided
    if (password) {
      updateData.passwordHash = await hash(password, 10)
    }

    await db.update(users).set(updateData).where(eq(users.id, id))

    return { success: true }
  } catch (error) {
    return { error: "Failed to update user" }
  }
}

export async function deleteUser(id: string) {
  try {
    // Check if the user to delete is an admin
    const targetUser = await db.select().from(users).where(eq(users.id, id)).limit(1)
    if (targetUser[0]?.role === "admin") {
      const adminCount = await db
        .select()
        .from(users)
        .where(eq(users.role, "admin"))
      if (adminCount.length === 1) {
        return { error: "Cannot delete the last admin. At least one admin must remain in the system." }
      }
    }
    await db.delete(users).where(eq(users.id, id))
    return { success: true }
  } catch (error) {
    return { error: "Failed to delete user" }
  }
} 
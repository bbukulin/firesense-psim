import { db } from "@/db";
import { users } from "@/db/schema/users-schema";
import { hashPassword } from "@/lib/auth";
import { eq } from "drizzle-orm";

async function seed() {
  try {
    // Check if admin user already exists
    const existingAdmin = await db.select().from(users).where(eq(users.role, 'admin')).limit(1);
    
    if (existingAdmin.length > 0) {
      console.log('Admin user already exists, skipping seed');
      return;
    }

    // Create admin user
    const adminPassword = process.env.ADMIN_INITIAL_PASSWORD;
    if (!adminPassword) {
      throw new Error('ADMIN_INITIAL_PASSWORD environment variable is required');
    }

    const hashedPassword = await hashPassword(adminPassword);

    await db.insert(users).values({
      username: 'Admin',
      email: 'admin@firesense.local',
      passwordHash: hashedPassword,
      role: 'admin',
      active: true,
    });

    console.log('Admin user created successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
}

// Run the seed function
seed()
  .then(() => {
    console.log('Seed completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Seed failed:', error);
    process.exit(1);
  }); 
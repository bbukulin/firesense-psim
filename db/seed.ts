import { db } from "@/db";
import { users } from "@/db/schema/users-schema";
import { hashPassword } from "@/lib/auth";
import { eq } from "drizzle-orm";

async function seed() {
  try {
    // Check if admin user already exists
    const existingAdmin = await db.select().from(users).where(eq(users.role, 'admin')).limit(1);
    const existingOperator = await db.select().from(users).where(eq(users.role, 'operator')).limit(1);
    
    if (existingAdmin.length > 0 && existingOperator.length > 0) {
      console.log('Admin and operator users already exist, skipping seed');
      return;
    }

    // Get initial passwords from environment
    const adminPassword = process.env.ADMIN_INITIAL_PASSWORD;
    const operatorPassword = process.env.OPERATOR_INITIAL_PASSWORD;

    if (!adminPassword || !operatorPassword) {
      throw new Error('ADMIN_INITIAL_PASSWORD and OPERATOR_INITIAL_PASSWORD environment variables are required');
    }

    // Create admin user if doesn't exist
    if (existingAdmin.length === 0) {
      const adminHashedPassword = await hashPassword(adminPassword);
      await db.insert(users).values({
        username: 'Admin',
        email: 'admin@firesense.local',
        passwordHash: adminHashedPassword,
        role: 'admin',
        active: true,
      });
      console.log('Admin user created successfully');
    }

    // Create operator user if doesn't exist
    if (existingOperator.length === 0) {
      const operatorHashedPassword = await hashPassword(operatorPassword);
      await db.insert(users).values({
        username: 'Operator',
        email: 'operator@firesense.local',
        passwordHash: operatorHashedPassword,
        role: 'operator',
        active: true,
      });
      console.log('Operator user created successfully');
    }
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
import { db } from "../index"
import { incidents, severityLevels } from "../schema/incidents-schema";
import { users } from "../schema/users-schema";
import { eq } from "drizzle-orm";

export async function seedIncidents() {
  console.log("📝 Checking for existing incidents...");

  // Check if incidents already exist
  const existingIncidents = await db.select().from(incidents).limit(1);
  if (existingIncidents.length > 0) {
    console.log("✅ Incidents already seeded, skipping...");
    return;
  }

  // First, get some user IDs to use for acknowledgments
  const operators = await db.select({ id: users.id }).from(users).where(eq(users.role, 'operator'));
  const admins = await db.select({ id: users.id }).from(users).where(eq(users.role, 'admin'));

  if (!operators.length || !admins.length) {
    throw new Error("No users found for seeding incidents. Please seed users first.");
  }

  const sampleIncidents = [
    // Recent active incidents
    {
      type: 'temperature' as const,
      description: 'High temperature detected in Server Room A (85°C)',
      severity: severityLevels.HIGH,
      timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      acknowledged: false,
      resolved: false,
    },
    {
      type: 'smoke' as const,
      description: 'Smoke detected in Warehouse Section B',
      severity: severityLevels.HIGH,
      timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
      acknowledged: true,
      acknowledgedBy: operators[0].id,
      acknowledgedAt: new Date(Date.now() - 1000 * 60 * 10), // 10 minutes ago
      resolved: false,
    },

    // Past incidents (last 24 hours)
    {
      type: 'gas' as const,
      description: 'Elevated CO2 levels in Office Area (1200 ppm)',
      severity: severityLevels.MEDIUM,
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12), // 12 hours ago
      acknowledged: true,
      acknowledgedBy: operators[0].id,
      acknowledgedAt: new Date(Date.now() - 1000 * 60 * 60 * 11), // 11 hours ago
      resolved: true,
      resolvedAt: new Date(Date.now() - 1000 * 60 * 60 * 10), // 10 hours ago
    },
    {
      type: 'fire' as const,
      description: 'Fire alarm triggered in Kitchen Area',
      severity: severityLevels.HIGH,
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8), // 8 hours ago
      acknowledged: true,
      acknowledgedBy: admins[0].id,
      acknowledgedAt: new Date(Date.now() - 1000 * 60 * 60 * 7), // 7 hours ago
      resolved: true,
      resolvedAt: new Date(Date.now() - 1000 * 60 * 60 * 6), // 6 hours ago
    },

    // Past incidents (last week)
    {
      type: 'temperature' as const,
      description: 'High temperature in Electrical Room (78°C)',
      severity: severityLevels.MEDIUM,
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
      acknowledged: true,
      acknowledgedBy: operators[0].id,
      acknowledgedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2 + 1000 * 60 * 30), // 2 days ago + 30 min
      resolved: true,
      resolvedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2 + 1000 * 60 * 60), // 2 days ago + 1 hour
    },
    {
      type: 'smoke' as const,
      description: 'Smoke detected in Storage Room C',
      severity: severityLevels.LOW,
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3 days ago
      acknowledged: true,
      acknowledgedBy: operators[0].id,
      acknowledgedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3 + 1000 * 60 * 15), // 3 days ago + 15 min
      resolved: true,
      resolvedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3 + 1000 * 60 * 30), // 3 days ago + 30 min
    },
    {
      type: 'gas' as const,
      description: 'Elevated methane levels in Basement (800 ppm)',
      severity: severityLevels.HIGH,
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4), // 4 days ago
      acknowledged: true,
      acknowledgedBy: admins[0].id,
      acknowledgedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4 + 1000 * 60 * 5), // 4 days ago + 5 min
      resolved: true,
      resolvedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4 + 1000 * 60 * 20), // 4 days ago + 20 min
    },
    {
      type: 'fire' as const,
      description: 'Fire alarm triggered in Workshop Area',
      severity: severityLevels.HIGH,
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5), // 5 days ago
      acknowledged: true,
      acknowledgedBy: operators[0].id,
      acknowledgedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5 + 1000 * 60 * 2), // 5 days ago + 2 min
      resolved: true,
      resolvedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5 + 1000 * 60 * 15), // 5 days ago + 15 min
    },
  ];

  try {
    await db.insert(incidents).values(sampleIncidents);
    console.log("✅ Incidents seeded successfully");
  } catch (error) {
    console.error("❌ Error seeding incidents:", error);
    throw error;
  }
} 
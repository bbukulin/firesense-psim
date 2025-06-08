import { db } from "@/db";
import { incidents } from "@/db/schema/incidents-schema";
import { users } from "@/db/schema/users-schema";
import { desc, eq } from "drizzle-orm";

export async function getAllIncidents() {
  return db
    .select({
      id: incidents.id,
      timestamp: incidents.timestamp,
      type: incidents.type,
      description: incidents.description,
      severity: incidents.severity,
      acknowledged: incidents.acknowledged,
      acknowledgedBy: incidents.acknowledgedBy,
      acknowledgedAt: incidents.acknowledgedAt,
      acknowledgedByEmail: users.email,
      resolved: incidents.resolved,
      resolvedAt: incidents.resolvedAt,
    })
    .from(incidents)
    .leftJoin(users, eq(incidents.acknowledgedBy, users.id))
    .orderBy(desc(incidents.timestamp));
} 
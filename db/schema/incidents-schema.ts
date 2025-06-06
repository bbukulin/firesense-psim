import { pgTable, serial, timestamp, varchar, text, boolean, integer, uuid } from 'drizzle-orm/pg-core';
import { users } from './users-schema';

// Define incident types as a const to ensure type safety
export const incidentTypes = ['fire', 'smoke', 'temperature', 'gas'] as const;
export type IncidentType = typeof incidentTypes[number];

// Define severity levels as a const
export const severityLevels = {
  LOW: 1,
  MEDIUM: 2,
  HIGH: 3,
} as const;

export const incidents = pgTable('incidents', {
  id: serial('id').primaryKey(),
  timestamp: timestamp('timestamp').notNull().defaultNow(),
  type: varchar('type', { length: 50 }).notNull(),
  description: text('description'),
  acknowledged: boolean('acknowledged').notNull().default(false),
  acknowledgedBy: uuid('acknowledged_by').references(() => users.id),
  acknowledgedAt: timestamp('acknowledged_at'),
  resolved: boolean('resolved').notNull().default(false),
  resolvedAt: timestamp('resolved_at'),
  severity: integer('severity').notNull().default(severityLevels.MEDIUM),
});

// Type for incident record
export type Incident = typeof incidents.$inferSelect;
// Type for creating new incident
export type NewIncident = typeof incidents.$inferInsert;

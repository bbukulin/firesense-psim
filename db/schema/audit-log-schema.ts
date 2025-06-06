import { pgTable, bigserial, timestamp, uuid, varchar, text } from 'drizzle-orm/pg-core';

export const auditLog = pgTable('audit_log', {
  id: bigserial('id', { mode: 'bigint' }).primaryKey(),
  timestamp: timestamp('timestamp').defaultNow().notNull(),
  userId: uuid('user_id'),
  actionType: varchar('action_type', { length: 50 }).notNull(),
  entityType: varchar('entity_type', { length: 50 }),
  entityId: uuid('entity_id'),
  description: text('description').notNull(),
});

// Types for TypeScript
export type AuditLog = typeof auditLog.$inferSelect;
export type NewAuditLog = typeof auditLog.$inferInsert;

// Common action types as constants for type safety
export const AuditActionType = {
  LOGIN: 'login',
  CREATE_USER: 'create_user',
  UPDATE_USER: 'update_user',
  DISABLE_USER: 'disable_user',
  CREATE_CAMERA: 'create_camera',
  UPDATE_CAMERA: 'update_camera',
  DELETE_CAMERA: 'delete_camera',
  ACK_INCIDENT: 'ack_incident',
  RESOLVE_INCIDENT: 'resolve_incident',
} as const;

// Common entity types as constants for type safety
export const AuditEntityType = {
  USER: 'user',
  CAMERA: 'camera',
  INCIDENT: 'incident',
} as const;

import { pgTable, bigserial, timestamp, numeric, text, boolean } from 'drizzle-orm/pg-core';

// Enum for sensor types
export const sensorTypeEnum = {
  TEMPERATURE: 'temperature',
  SMOKE: 'smoke',
  GAS: 'gas',
} as const;

// Sensors table - stores sensor metadata
export const sensors = pgTable('sensors', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  name: text('name').notNull(),
  type: text('type').notNull(), // Using text instead of enum for flexibility
  location: text('location'),
  description: text('description'),
  active: boolean('active').notNull().default(true),
  created_at: timestamp('created_at').notNull().defaultNow(),
  updated_at: timestamp('updated_at').notNull().defaultNow(),
});

// Sensor readings table - stores actual sensor data
export const sensorReadings = pgTable('sensor_readings', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  sensor_id: bigserial('sensor_id', { mode: 'number' }).notNull().references(() => sensors.id),
  timestamp: timestamp('timestamp').notNull().defaultNow(),
  value: numeric('value').notNull(), // Using numeric for precise readings
  // Optional boolean flag for smoke detection
  smoke_detected: boolean('smoke_detected'),
  // Optional metadata as JSON if needed
  metadata: text('metadata'), // Could store additional readings or context
});

// Types for TypeScript
export type Sensor = typeof sensors.$inferSelect;
export type NewSensor = typeof sensors.$inferInsert;
export type SensorReading = typeof sensorReadings.$inferSelect;
export type NewSensorReading = typeof sensorReadings.$inferInsert;

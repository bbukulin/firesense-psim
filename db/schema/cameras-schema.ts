import { pgTable, uuid, varchar, boolean, timestamp, text } from "drizzle-orm/pg-core";
import { users } from "./users-schema";

// Define the cameras table
export const cameras = pgTable(
  "cameras",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", { length: 100 }).notNull(),
    location: varchar("location", { length: 100 }),
    streamUrl: text("stream_url").notNull(),
    active: boolean("active").notNull().default(true),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    createdBy: uuid("created_by").references(() => users.id),
  },
);

// Type for the cameras table
export type Camera = typeof cameras.$inferSelect;
export type NewCamera = typeof cameras.$inferInsert;

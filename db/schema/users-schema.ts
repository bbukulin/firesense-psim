import { pgTable, uuid, varchar, boolean, timestamp, index } from "drizzle-orm/pg-core";

// Define the role enum type
export const userRoleEnum = {
  ADMIN: "admin",
  OPERATOR: "operator",
} as const;

// Define the users table
export const users = pgTable(
  "users",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    username: varchar("username", { length: 100 }).notNull(),
    email: varchar("email", { length: 100 }).notNull().unique(),
    passwordHash: varchar("password_hash", { length: 255 }).notNull(),
    role: varchar("role", { length: 20 }).notNull().$type<typeof userRoleEnum[keyof typeof userRoleEnum]>(),
    active: boolean("active").notNull().default(true),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow().$onUpdate(() => new Date()),
  },
);

// Type for the users table
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

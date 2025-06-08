import {config} from "dotenv";
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";

config({path: ".env.local"});

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
    throw new Error("DATABASE_URL is not set");
}

const client = postgres(connectionString, {
    prepare: false,
    max: 10, // Maximum number of connections in the pool
    idle_timeout: 20, // Maximum idle time for a connection in seconds
    connect_timeout: 10, // Connection timeout in seconds
});

export const db = drizzle(client); 
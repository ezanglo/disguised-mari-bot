import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from './schema';

const connectionString = process.env.DATABASE_URL as string;
export const pool = postgres(connectionString, {max: 1})

export const db = drizzle(pool, {schema})
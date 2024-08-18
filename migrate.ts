import "./envConfig"

import { db, pool } from "@/db";
import { migrate } from "drizzle-orm/postgres-js/migrator";

async function main() {
	await migrate(db, { migrationsFolder: "./drizzle"})
	await pool.end();
}

main();
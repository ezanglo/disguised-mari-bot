import "./envConfig"
import { defineConfig } from "drizzle-kit";

export default defineConfig({
	schema: "./src/db/schema/*.ts",
	dialect: "postgresql",
	out: "./drizzle",
	dbCredentials: {
		url: process.env.DATABASE_URL as string,
	},
	verbose: true,
	strict: true,
});
import "dotenv/config";
import { defineConfig } from "drizzle-kit";

if (!process.env.DATABASE_URL) {
  console.warn("DATABASE_URL is not set");
}

export default defineConfig({
  out: "./drizzle",
  schema: "./src/schema",
  dialect: "postgresql",

  dbCredentials: {
    // biome-ignore lint/style/noNonNullAssertion: env var checked in file
    url: process.env.DATABASE_URL!,
  },
  casing: "snake_case",
});

import postgres from "postgres";

import "dotenv/config";

import { drizzle } from "drizzle-orm/postgres-js";

import * as schema from "./schema";

const getEnvVariable = (name: string) => {
  const value = process.env[name];
  if (value == null) throw new Error(`environment variable ${name} not found`);
  return value;
};

export const client = postgres(getEnvVariable("DATABASE_URL"), {
  prepare: false,
});

export const createDBClient = () =>
  drizzle(client, { schema, casing: "snake_case" });

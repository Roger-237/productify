import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";
import { ENV } from "../config/env";


if (!ENV.DATABASE_URL) {
  throw new Error("DB_URL environment variable is not set");
}

// initialise postgressql connection pool
const pool = new Pool({
  connectionString: ENV.DATABASE_URL,
});



// log when first connection is made 
pool.on("connect", () => {
  console.log("Connected to the database");
});

pool.on("error", (err) => {
  console.error("Database error:", err);
});

export const db = drizzle({client: pool,schema });

import { DB } from "../types/db";
import { Pool } from "pg";
import { Kysely, PostgresDialect } from "kysely";
import env from "./constants";

const dialect = new PostgresDialect({
  pool: new Pool({
    database: env.DB_NAME,
    host: env.DB_HOST,
    user: env.DB_USERNAME,
    port: env.DB_PORT,
    max: 10,
    password: env.DB_PASSWORD,
  }),
});

// Database interface is passed to Kysely's constructor, and from now on, Kysely
// knows your database structure.
// Dialect is passed to Kysely's constructor, and from now on, Kysely knows how
// to communicate with your database.
export const db = new Kysely<DB>({
  dialect,
});

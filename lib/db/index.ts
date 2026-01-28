import { neon, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";

import { env } from "@/lib/env";
import * as schema from "@/lib/db/schema";

neonConfig.fetchConnectionCache = true;

const sql = neon(env().DATABASE_URL);

export const db = drizzle(sql, { schema });

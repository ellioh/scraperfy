import mysql, { Pool, RowDataPacket, ResultSetHeader } from "mysql2/promise";

// Pool unico por proceso. En dev, el HMR recarga los modulos: se guarda en
// globalThis para no abrir un pool nuevo en cada recarga.
const globalForDb = globalThis as unknown as { __scraperfyPool?: Pool };

function createPool(): Pool {
  const host = process.env.DB_HOST;
  const database = process.env.DB_NAME;
  if (!host || !database) {
    throw new Error("Base de datos no configurada: define DB_HOST y DB_NAME (ver .env.example)");
  }
  return mysql.createPool({
    host,
    port: Number(process.env.DB_PORT ?? 3306),
    user: process.env.DB_USER ?? "root",
    password: process.env.DB_PASSWORD ?? "",
    database,
    ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: true } : undefined,
    charset: "utf8mb4",
    timezone: "Z", // DATETIME se guarda y lee siempre en UTC
    waitForConnections: true,
    connectionLimit: Number(process.env.DB_POOL_SIZE ?? 5),
    connectTimeout: 10_000,
  });
}

export function getPool(): Pool {
  if (!globalForDb.__scraperfyPool) globalForDb.__scraperfyPool = createPool();
  return globalForDb.__scraperfyPool;
}

export async function query<T extends RowDataPacket>(sql: string, params: unknown[] = []): Promise<T[]> {
  const [rows] = await getPool().query<T[]>(sql, params);
  return rows;
}

export async function execute(sql: string, params: unknown[] = []): Promise<ResultSetHeader> {
  const [result] = await getPool().query<ResultSetHeader>(sql, params);
  return result;
}

/** Convierte una fecha (Date de mysql2 o string) a ISO 8601. */
export function toIso(value: Date | string): string {
  return new Date(value).toISOString();
}

/** Parsea una columna TEXT que guarda un array JSON, tolerando datos corruptos. */
export function parseJsonArray(value: unknown): string[] {
  if (Array.isArray(value)) return value.map(String);
  if (typeof value !== "string" || !value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.map(String) : [];
  } catch {
    return [];
  }
}

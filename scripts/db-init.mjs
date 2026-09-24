// Crea la base de datos y las tablas, y siembra los datos iniciales desde /data/*.json
// si las tablas estan vacias. Es idempotente: se puede correr varias veces.
//
//   npm run db:init
//
// Lee la conexion de las variables DB_* (ver .env.example). En local las toma de
// .env.local via `node --env-file`; en un servidor basta con tenerlas exportadas.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import mysql from "mysql2/promise";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const { DB_HOST, DB_PORT = "3306", DB_USER = "root", DB_PASSWORD = "", DB_NAME, DB_SSL } = process.env;

if (!DB_HOST || !DB_NAME) {
  console.error("Faltan DB_HOST y/o DB_NAME. Copia .env.example a .env.local y completalo.");
  process.exit(1);
}
if (!/^[A-Za-z0-9_]+$/.test(DB_NAME)) {
  console.error("DB_NAME solo puede contener letras, numeros y guion bajo.");
  process.exit(1);
}

const base = {
  host: DB_HOST,
  port: Number(DB_PORT),
  user: DB_USER,
  password: DB_PASSWORD,
  ssl: DB_SSL === "true" ? { rejectUnauthorized: true } : undefined,
  charset: "utf8mb4",
  timezone: "Z",
};

function readJson(file) {
  const p = path.join(root, "data", file);
  return fs.existsSync(p) ? JSON.parse(fs.readFileSync(p, "utf-8")) : [];
}

const toDate = (v) => {
  const d = new Date(v);
  return Number.isNaN(d.getTime()) ? new Date() : d;
};

async function seed(conn, tabla, filas, columnas, mapRow) {
  const [[{ n }]] = await conn.query(`SELECT COUNT(*) AS n FROM ${tabla}`);
  if (n > 0) return console.log(`  ${tabla}: ya tiene ${n} filas, no se siembra`);
  if (filas.length === 0) return console.log(`  ${tabla}: sin datos de semilla`);
  const placeholders = `(${columnas.map(() => "?").join(",")})`;
  for (const fila of filas) {
    await conn.query(`INSERT IGNORE INTO ${tabla} (${columnas.join(",")}) VALUES ${placeholders}`, mapRow(fila));
  }
  console.log(`  ${tabla}: ${filas.length} filas sembradas`);
}

// 1) Crear la base (en hosting gestionado el usuario puede no tener permiso: se continua)
const admin = await mysql.createConnection(base);
try {
  await admin.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
} catch (err) {
  console.warn(`No se pudo crear la base (${err.code}); se asume que "${DB_NAME}" ya existe.`);
}
await admin.end();

// 2) Tablas + semilla
const conn = await mysql.createConnection({ ...base, database: DB_NAME, multipleStatements: true });
try {
  await conn.query(fs.readFileSync(path.join(root, "db", "schema.sql"), "utf-8"));
  console.log(`Tablas listas en "${DB_NAME}".`);

  await seed(conn, "posts", readJson("posts.json"),
    ["id", "slug", "titulo", "resumen", "contenido", "categoria", "tags", "meta_descripcion", "publicado", "fecha_publicacion", "fecha_actualizacion"],
    (p) => [
      String(p.id), p.slug, p.titulo, p.resumen ?? "", p.contenido, p.categoria ?? "General",
      JSON.stringify(p.tags ?? []), p.metaDescripcion ?? p.resumen ?? "", p.publicado ? 1 : 0,
      toDate(p.fechaPublicacion), toDate(p.fechaActualizacion ?? p.fechaPublicacion),
    ]);

  await seed(conn, "productos", readJson("productos.json"),
    ["id", "nombre", "descripcion", "precio", "moneda", "tipo", "etiqueta", "caracteristicas", "cta", "activo", "orden"],
    (p) => [
      String(p.id), p.nombre, p.descripcion ?? "", p.precio ?? 0, p.moneda ?? "S/.", p.tipo ?? "unico",
      p.etiqueta ?? "", JSON.stringify(p.caracteristicas ?? []), p.cta ?? "Solicitar", p.activo ? 1 : 0, p.orden ?? 99,
    ]);

  await seed(conn, "solicitudes", readJson("solicitudes.json"),
    ["id", "nombre", "email", "empresa", "url_objetivo", "frecuencia", "formato", "descripcion", "plan", "fecha", "leido"],
    (s) => [
      String(s.id), s.nombre, s.email, s.empresa ?? "", s.url_objetivo, s.frecuencia, s.formato,
      s.descripcion ?? "", s.plan ?? "", toDate(s.fecha), s.leido ? 1 : 0,
    ]);

  console.log("Listo.");
} finally {
  await conn.end();
}

import type { RowDataPacket } from "mysql2/promise";
import { execute, parseJsonArray, query } from "@/lib/db";

export interface Producto {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  moneda: string;
  tipo: "unico" | "mensual" | "cotizar";
  etiqueta: string;
  caracteristicas: string[];
  cta: string;
  activo: boolean;
  orden: number;
}

interface ProductoRow extends RowDataPacket {
  id: string;
  nombre: string;
  descripcion: string;
  precio: string | number; // DECIMAL llega como string
  moneda: string;
  tipo: Producto["tipo"];
  etiqueta: string;
  caracteristicas: string;
  cta: string;
  activo: number;
  orden: number;
}

function toProducto(r: ProductoRow): Producto {
  return {
    id: r.id,
    nombre: r.nombre,
    descripcion: r.descripcion,
    precio: Number(r.precio),
    moneda: r.moneda,
    tipo: r.tipo,
    etiqueta: r.etiqueta,
    caracteristicas: parseJsonArray(r.caracteristicas),
    cta: r.cta,
    activo: Boolean(r.activo),
    orden: r.orden,
  };
}

export async function getProductos(soloActivos = true): Promise<Producto[]> {
  const rows = await query<ProductoRow>(
    `SELECT * FROM productos ${soloActivos ? "WHERE activo = 1" : ""} ORDER BY orden, nombre`
  );
  return rows.map(toProducto);
}

export async function getProductoById(id: string): Promise<Producto | undefined> {
  const rows = await query<ProductoRow>("SELECT * FROM productos WHERE id = ? LIMIT 1", [id]);
  return rows[0] ? toProducto(rows[0]) : undefined;
}

const TIPOS: Producto["tipo"][] = ["unico", "mensual", "cotizar"];

export async function saveProducto(data: Partial<Producto> & { nombre: string }): Promise<Producto> {
  const producto: Producto = {
    id: data.id || Date.now().toString(),
    nombre: data.nombre,
    descripcion: data.descripcion || "",
    precio: data.precio ?? 0,
    moneda: data.moneda || "S/.",
    tipo: data.tipo || "unico",
    etiqueta: data.etiqueta || "",
    caracteristicas: data.caracteristicas || [],
    cta: data.cta || "Solicitar",
    activo: data.activo ?? true,
    orden: data.orden ?? 99,
  };

  if (!TIPOS.includes(producto.tipo)) throw new Error("Tipo de servicio invalido");
  if (!Number.isFinite(producto.precio) || producto.precio < 0) throw new Error("Precio invalido");

  await execute(
    `INSERT INTO productos
       (id, nombre, descripcion, precio, moneda, tipo, etiqueta, caracteristicas, cta, activo, orden)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE
       nombre = VALUES(nombre), descripcion = VALUES(descripcion), precio = VALUES(precio),
       moneda = VALUES(moneda), tipo = VALUES(tipo), etiqueta = VALUES(etiqueta),
       caracteristicas = VALUES(caracteristicas), cta = VALUES(cta),
       activo = VALUES(activo), orden = VALUES(orden)`,
    [
      producto.id, producto.nombre, producto.descripcion, producto.precio, producto.moneda,
      producto.tipo, producto.etiqueta, JSON.stringify(producto.caracteristicas), producto.cta,
      producto.activo ? 1 : 0, producto.orden,
    ]
  );
  return producto;
}

export async function deleteProducto(id: string): Promise<void> {
  await execute("DELETE FROM productos WHERE id = ?", [id]);
}

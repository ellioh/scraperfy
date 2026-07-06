import fs from "fs";
import path from "path";

const dataDir = path.join(process.cwd(), "data");

function readProductos(): Producto[] {
  const p = path.join(dataDir, "productos.json");
  if (!fs.existsSync(p)) return [];
  return JSON.parse(fs.readFileSync(p, "utf-8"));
}

function writeProductos(productos: Producto[]) {
  fs.writeFileSync(path.join(dataDir, "productos.json"), JSON.stringify(productos, null, 2));
}

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

export function getProductos(soloActivos = true): Producto[] {
  const all = readProductos();
  return (soloActivos ? all.filter((p) => p.activo) : all).sort((a, b) => a.orden - b.orden);
}

export function getProductoById(id: string): Producto | undefined {
  return readProductos().find((p) => p.id === id);
}

export function saveProducto(data: Partial<Producto> & { nombre: string }): Producto {
  const all = readProductos();
  const isNew = !data.id;

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

  if (isNew) {
    all.push(producto);
  } else {
    const idx = all.findIndex((p) => p.id === producto.id);
    if (idx >= 0) all[idx] = producto;
    else all.push(producto);
  }

  writeProductos(all);
  return producto;
}

export function deleteProducto(id: string) {
  writeProductos(readProductos().filter((p) => p.id !== id));
}

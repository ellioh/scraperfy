import fs from "fs";
import path from "path";

const dataDir = path.join(process.cwd(), "data");

function readJson<T>(file: string): T {
  const p = path.join(dataDir, file);
  if (!fs.existsSync(p)) return [] as unknown as T;
  return JSON.parse(fs.readFileSync(p, "utf-8"));
}

function writeJson(file: string, data: unknown) {
  fs.writeFileSync(path.join(dataDir, file), JSON.stringify(data, null, 2));
}

export interface Solicitud {
  id: string;
  nombre: string;
  email: string;
  empresa: string;
  url_objetivo: string;
  frecuencia: string;
  formato: string;
  descripcion: string;
  plan: string;
  fecha: string;
  leido: boolean;
}

export function getSolicitudes(): Solicitud[] {
  return readJson<Solicitud[]>("solicitudes.json");
}

export function saveSolicitud(s: Omit<Solicitud, "id" | "fecha" | "leido">): Solicitud {
  const all = getSolicitudes();
  const nueva: Solicitud = {
    ...s,
    id: Date.now().toString(),
    fecha: new Date().toISOString(),
    leido: false,
  };
  all.unshift(nueva);
  writeJson("solicitudes.json", all);
  return nueva;
}

export function marcarLeido(id: string) {
  writeJson(
    "solicitudes.json",
    getSolicitudes().map((s) => (s.id === id ? { ...s, leido: true } : s))
  );
}

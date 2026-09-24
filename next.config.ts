import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Genera .next/standalone (servidor minimo con solo las dependencias usadas):
  // es lo que empaqueta el Dockerfile y permite `node server.js` en una VPS.
  output: "standalone",
  // mysql2 hace require dinamicos (charsets, plugins de auth): se carga desde
  // node_modules en vez de empaquetarlo, y el standalone lo incluye por tracing.
  serverExternalPackages: ["mysql2"],
  // /precios duplicaba /servicios con planes fijos (Free/Pro) que no existen en el gestor.
  // Los precios reales viven en la BD y se muestran en /servicios; se conservan los enlaces viejos.
  async redirects() {
    return [{ source: "/precios", destination: "/servicios", permanent: true }];
  },
};

export default nextConfig;

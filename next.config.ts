import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Genera .next/standalone (servidor minimo con solo las dependencias usadas):
  // es lo que empaqueta el Dockerfile y permite `node server.js` en una VPS.
  output: "standalone",
  // mysql2 hace require dinamicos (charsets, plugins de auth): se carga desde
  // node_modules en vez de empaquetarlo, y el standalone lo incluye por tracing.
  serverExternalPackages: ["mysql2"],
};

export default nextConfig;

# syntax=docker/dockerfile:1
# Imagen de produccion de scraperfy (Next.js standalone). Tres destinos:
#   runner  -> la app web (destino por defecto, ultimo stage)
#   migrate -> job de un solo uso: crea tablas y siembra la BD (npm run db:init)

FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM node:22-alpine AS build
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# El build NO necesita la base de datos (las paginas son dinamicas).
RUN npm run build

# Reutiliza el stage de build: ya trae node_modules (mysql2), scripts/, db/ y data/.
FROM build AS migrate
CMD ["node", "scripts/db-init.mjs"]

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0
RUN addgroup -S app && adduser -S app -G app
COPY --from=build --chown=app:app /app/.next/standalone ./
COPY --from=build --chown=app:app /app/.next/static ./.next/static
COPY --from=build --chown=app:app /app/public ./public
USER app
EXPOSE 3000
CMD ["node", "server.js"]

# scraperfy.com — Contexto para Claude Code

SaaS de web scraping como servicio para empresas en Peru y Latinoamerica.
Landing page de producto, catalogo de servicios, blog tecnico, captacion de leads.
Los "productos" son servicios (extraccion de datos), no e-commerce — el flujo termina en contacto/cotizacion.

- URL produccion: https://scraperfy.com
- Repo: https://github.com/ellioh/scraperfy (rama `main`)
- Deploy: Vercel — cada push a main despliega automaticamente (necesita una MySQL externa y las vars `DB_*`; sin ellas las paginas dan 500)
- Deploy en VPS: `Dockerfile` + `docker-compose.yml` (MySQL + migracion + app + Caddy opcional). Guia completa en `DEPLOY.md`, plantilla de variables en `.env.vps.example`. `next.config.ts` usa `output: "standalone"` y `mysql2` como paquete externo (no quitarlos).
- En produccion la cookie de admin es `Secure`: el login solo funciona por HTTPS.

---

## Instruccion permanente

**Despues de CADA tarea completada**: `git add`, `git commit`, `git push`.
Sin excepcion. No esperar a que el usuario lo pida.

---

## Stack

| Que          | Cual                                      |
|--------------|-------------------------------------------|
| Framework    | Next.js 15.3.3 (App Router), React 19     |
| Lenguaje     | TypeScript 5 strict                       |
| Estilos      | Tailwind CSS 3 — clases directas, sin CSS modules |
| Base de datos| MySQL / MariaDB via `mysql2` (SQL directo, sin ORM) — `lib/db.ts` |
| Automatizacion| n8n por webhook (`lib/n8n.ts`, opcional)  |
| Auth         | Cookie httpOnly propia (sin NextAuth)     |
| Markdown     | Renderer propio en `lib/markdown.ts`      |
| Dependencias | next + react + react-dom + mysql2         |

Comandos:
```
npm run dev        # desarrollo (necesita MySQL corriendo)
npm run build      # build + typecheck (NO necesita la BD)
npx tsc --noEmit   # solo typecheck
npm run db:init    # crea BD + tablas y siembra desde data/*.json (idempotente)
```

Setup local: copiar `.env.example` a `.env.local`, tener MySQL/MariaDB arriba
(XAMPP sirve: `C:\xampp8.2.12\mysql\bin\mysqld.exe --defaults-file=my.ini`) y correr `npm run db:init`.

---

## Paleta de colores (NO mezclar con hleon-dev)

| Rol          | Clase Tailwind                            |
|--------------|-------------------------------------------|
| Fondo        | `gray-950`                                |
| Acento       | `emerald-400` / `emerald-500`             |
| Secundario   | `cyan-400` (gradientes, enterprise)       |
| Texto        | `white` (h1), `gray-300/400` (cuerpo)    |
| Bordes       | `gray-800`                                |
| Card hover   | `border-emerald-800/60`, `text-emerald-300` |
| Punto logo   | `bg-emerald-400 animate-pulse`            |
| Gradiente    | `from-emerald-400 to-cyan-400`            |
| Popular      | `border-emerald-500 bg-emerald-950/30`    |
| Enterprise   | `border-cyan-700/50 bg-cyan-950/20`       |

---

## Estructura de archivos

```
app/
  layout.tsx                  — metadata SEO global + JSON-LD Organization + WebSite
  page.tsx                    — Homepage (server component, usa ScraperfyNav)
  servicios/page.tsx          — Catalogo publico de servicios (llama getProductos())
  blog/
    page.tsx / [slug]/page.tsx / categoria/[categoria]/page.tsx
  contacto/page.tsx           — Server: lee servicios de la BD y renderiza <ContactoForm/>
  (/precios y /docs ya no existen: next.config.ts las redirige a /servicios)
  sitemap.ts / robots.ts
  feed.xml/route.ts           — RSS 2.0
  admin/
    page.tsx                  — Login
    dashboard/
      page.tsx                — Stats + quick links (SIN sidebar compartido)
      solicitudes/page.tsx
      blog/
        page.tsx / nuevo/page.tsx / [id]/page.tsx
      productos/page.tsx      — CRUD inline (form embebido en la misma pagina)
  api/
    contacto/route.ts
    admin/
      login/ logout/ solicitudes/ blog/ blog/[id]/ productos/

components/
  ScraperfyNav.tsx            — Navbar "use client" (extraida para que page.tsx sea server)
  ProductosGrid.tsx           — Tarjetas de servicio/precio (server). UNICA definicion visual: home y /servicios
  ContactoForm.tsx            — Formulario de contacto "use client"; recibe los servicios por props

lib/                          — TODAS las funciones de datos son async (await)
  auth.ts        — isAuthenticated(), cookie: "scraperfy_admin_token"
  db.ts          — pool mysql2 (singleton), query(), execute(), toIso(), parseJsonArray()
  blog.ts        — getPosts, getPost, getPostById, savePost, deletePost,
                   getCategorias, getPostsByCategoria, slugify
  data.ts        — getSolicitudes, saveSolicitud, marcarLeido
  markdown.ts    — renderMarkdown(raw): string
  n8n.ts         — notificarSolicitud(): POST al webhook de n8n (nunca lanza)
  productos.ts   — getProductos, getProductoById, saveProducto, deleteProducto

db/schema.sql                 — tablas posts, productos, solicitudes
scripts/db-init.mjs           — aplica schema.sql + siembra desde data/*.json
data/                         — SOLO semilla inicial (ya no es la fuente de verdad)
  posts.json / productos.json / solicitudes.json
```

**Diferencia clave vs hleon-dev:** scraperfy NO tiene layout/sidebar compartido en el dashboard. Cada pagina admin es standalone con link `← Dashboard`.

---

## Modelos de datos

Viven en MySQL (tablas `posts`, `productos`, `solicitudes`, columnas en snake_case; ver `db/schema.sql`).
Las interfaces TS mantienen camelCase (`fechaPublicacion`, `metaDescripcion`): el mapeo esta en `lib/*.ts`.
Los arrays (`tags`, `caracteristicas`) se guardan como JSON en columnas TEXT. Fechas: DATETIME en UTC.
Los ejemplos de abajo son el formato de la semilla en `data/*.json`.

**Post** (`data/posts.json`):
```json
{
  "id": "post-001",
  "titulo": "...",
  "slug": "slug-kebab-case",
  "resumen": "...",
  "contenido": "## H2\n\nMarkdown...",
  "categoria": "Tutorial",
  "fechaPublicacion": "2025-01-15",
  "fechaActualizacion": "2025-01-15",
  "tags": ["web scraping", "python"],
  "metaDescripcion": "max 160 chars",
  "publicado": true
}
```

**Producto** (`data/productos.json`):
```json
{
  "id": "svc-001",
  "nombre": "Extraccion Unica",
  "descripcion": "...",
  "precio": 199,
  "moneda": "S/.",
  "tipo": "unico",
  "etiqueta": "Mas popular",
  "caracteristicas": ["Hasta 10,000 URLs", "Entrega en 24h"],
  "cta": "Contratar ahora",
  "activo": true,
  "orden": 1
}
```
Tipo puede ser: `"unico"` | `"mensual"` | `"cotizar"`

**Solicitud** (`data/solicitudes.json`):
```json
{
  "id": "1700000000000",
  "nombre": "...", "email": "...", "empresa": "...",
  "url_objetivo": "https://...", "frecuencia": "diario",
  "formato": "JSON", "descripcion": "...", "plan": "Pro",
  "fecha": "2025-01-15T10:00:00.000Z",
  "leido": false
}
```

---

## Autenticacion admin

- Cookie: `scraperfy_admin_token`
- Env vars: `ADMIN_PASSWORD`, `ADMIN_TOKEN_SECRET`
- Env vars BD: `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `DB_SSL`, `DB_POOL_SIZE`
- Env vars n8n (opcionales): `N8N_WEBHOOK_URL`, `N8N_WEBHOOK_SECRET` (header `X-Scraperfy-Secret`)
- Flujo: login → POST `/api/admin/login` → cookie httpOnly → `isAuthenticated()` (de `lib/auth.ts`) en TODAS las rutas protegidas, incluidas las API de blog y productos

---

## Convenciones clave

1. **Server components por defecto.** `"use client"` solo si hay `useState`, `useEffect` o eventos.
2. **Nunca importar `lib/*.ts` en `"use client"`** — usan `mysql2` (Node.js). Y recordar `await`: todas las funciones de datos son async.
3. La **navbar** vive en `components/ScraperfyNav.tsx` ("use client") para que `app/page.tsx` pueda ser server component y llamar a `getPosts()`.
4. API routes de `/api/admin/*`: siempre verificar auth primero. Error: `{ error: "No autorizado" }` status 401.
5. Paginas/rutas que leen la BD llevan `export const dynamic = "force-dynamic"` (sin `generateStaticParams`): el contenido se edita desde el admin y el build no debe depender de la BD. `generateMetadata` para SEO.
6. IDs: strings (VARCHAR). Nuevos registros: `Date.now().toString()`.
   `savePost` hace INSERT o UPDATE explicito (NO `ON DUPLICATE KEY`, que sobrescribiria otro post con el mismo slug).
7. Para agregar link al nav: editar `components/ScraperfyNav.tsx` (menu desktop Y mobile).
8. Para agregar pagina publica: crear `app/nueva/page.tsx` y agregar a `app/sitemap.ts`.

---

## Markdown renderer (lib/markdown.ts)

Renderer propio. Clases aplicadas (paleta scraperfy — diferente a hleon-dev):
- H2: `text-2xl font-bold text-white mt-8 mb-4`
- Codigo: `bg-gray-800 ... text-emerald-300`
- Parrafos: `text-gray-300 leading-relaxed mb-4`
- Bullets: `text-emerald-400`
- Links: `text-emerald-400 hover:text-emerald-300`

Uso: `<div dangerouslySetInnerHTML={{ __html: renderMarkdown(post.contenido) }} />`

---

## Precios y servicios: UNA sola fuente (la BD)

Nunca escribir precios ni planes en el codigo. Todo sale de `productos` (admin > Productos):
- Home (`#precios`) y `/servicios` → `<ProductosGrid productos={await getProductos()} />`
- `/contacto` → desplegable "Servicio de interes" con los servicios activos; `?plan=<nombre>` lo preselecciona (las tarjetas enlazan asi). Lo guardado en `solicitudes.plan` es el nombre del servicio.
- Meta description de `/servicios`: el "desde S/. X" se calcula del servicio activo mas barato.
- `/precios` es una redireccion permanente a `/servicios` (`next.config.ts`).
- Precios de ejemplo dentro de bloques de codigo (home, `S/. 2,499.00`) son datos de muestra de una extraccion, no planes.

## Modelo de entrega: SOLO ARCHIVOS (decision del dueno)

Scraperfy entrega los datos como archivos (Excel/CSV/JSON), NO ofrece API ni webhooks a clientes: una API exigiria un VPS dedicado y mantenimiento. Por eso se elimino `/docs` (documentacion de una API inexistente), la seccion "API REST" de la home, el cartel "API v2" y la opcion "Webhook" del formulario. No reintroducir promesas de API/webhook/dashboard de cliente sin decision explicita. (El webhook de `lib/n8n.ts` es interno: avisa al dueno de una solicitud nueva, no es un servicio al cliente.)

### /servicios

`app/servicios/page.tsx` es server component. Llama `getProductos()` (solo activos).
Highlighting por etiqueta:
- `"Mas popular"` → `border-emerald-500 bg-emerald-950/30`
- `"Enterprise"` → `border-cyan-700/50 bg-cyan-950/20`
- `""` → `border-gray-800 bg-gray-900/50`

Perfiles de Upwork/Workana en `/servicios`: buscar `href="#"` y reemplazar con URLs reales.

---

## Errores comunes

| Error | Causa | Solucion |
|-------|-------|----------|
| "only works in a Client Component" | Importar lib/*.ts en "use client" | Mover a server component o API route |
| Tipo union no asignable a literal | useState infiere tipo estrecho | Declarar `type Tipo = "unico"\|"mensual"\|"cotizar"` y `useState<FormState>` |
| 401 en API blog/productos | Sesion vencida o `ADMIN_TOKEN_SECRET` distinto al usado al hacer login | Volver a iniciar sesion en /admin |
| /blog/categoria/casos de uso — URL rota | Categoria con espacio | Usar `encodeURIComponent` en links, `decodeURIComponent` al leer |

---

## Referencia completa

Ver `leame-IA.txt` en la raiz del repo para documentacion extendida.

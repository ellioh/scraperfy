# scraperfy.com — Contexto para Claude Code

SaaS de web scraping como servicio para empresas en Peru y Latinoamerica.
Landing page de producto, catalogo de servicios, blog tecnico, captacion de leads.
Los "productos" son servicios (extraccion de datos), no e-commerce — el flujo termina en contacto/cotizacion.

- URL produccion: https://scraperfy.com
- Repo: https://github.com/ellioh/scraperfy (rama `main`)
- Deploy: Vercel — cada push a main despliega automaticamente

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
| Base de datos| Ninguna — JSON planos en `/data/`         |
| Auth         | Cookie httpOnly propia (sin NextAuth)     |
| Markdown     | Renderer propio en `lib/markdown.ts`      |
| Dependencias | Solo next + react + react-dom             |

Comandos:
```
npm run dev        # desarrollo
npm run build      # build + typecheck
npx tsc --noEmit   # solo typecheck
```

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
  contacto/page.tsx
  precios/page.tsx / docs/page.tsx
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

lib/
  auth.ts        — isAuthenticated(), cookie: "scraperfy_admin_token"
  blog.ts        — getPosts, getPost, getPostById, savePost, deletePost,
                   getCategorias, getPostsByCategoria, slugify
  data.ts        — getSolicitudes, saveSolicitud, marcarLeido
  markdown.ts    — renderMarkdown(raw): string
  productos.ts   — getProductos, getProductoById, saveProducto, deleteProducto

data/
  posts.json / productos.json / solicitudes.json
```

**Diferencia clave vs hleon-dev:** scraperfy NO tiene layout/sidebar compartido en el dashboard. Cada pagina admin es standalone con link `← Dashboard`.

---

## Modelos de datos

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
- Env vars: `ADMIN_PASSWORD`, `ADMIN_TOKEN_SECRET`, `ADMIN_SECRET`
- Flujo: login → POST `/api/admin/login` → cookie httpOnly → `isAuthenticated()` en rutas protegidas
- Las API routes de blog y productos verifican `cookie === ADMIN_SECRET` directamente

---

## Convenciones clave

1. **Server components por defecto.** `"use client"` solo si hay `useState`, `useEffect` o eventos.
2. **Nunca importar `lib/*.ts` en `"use client"`** — usan `fs` de Node.js.
3. La **navbar** vive en `components/ScraperfyNav.tsx` ("use client") para que `app/page.tsx` pueda ser server component y llamar a `getPosts()`.
4. API routes de `/api/admin/*`: siempre verificar auth primero. Error: `{ error: "No autorizado" }` status 401.
5. `generateStaticParams` en rutas dinamicas del blog. `generateMetadata` para SEO.
6. IDs: strings. Nuevos registros: `Date.now().toString()`.
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

## Pagina de servicios (/servicios)

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
| 401 en API blog/productos | `ADMIN_SECRET` no configurado | Agregar a .env.local |
| /blog/categoria/casos de uso — URL rota | Categoria con espacio | Usar `encodeURIComponent` en links, `decodeURIComponent` al leer |

---

## Referencia completa

Ver `leame-IA.txt` en la raiz del repo para documentacion extendida.

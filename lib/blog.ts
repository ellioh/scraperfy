import type { RowDataPacket } from "mysql2/promise";
import { execute, parseJsonArray, query, toIso } from "@/lib/db";

export interface Post {
  id: string;
  slug: string;
  titulo: string;
  resumen: string;
  contenido: string;
  categoria: string;
  tags: string[];
  metaDescripcion: string;
  publicado: boolean;
  fechaPublicacion: string;
  fechaActualizacion: string;
}

interface PostRow extends RowDataPacket {
  id: string;
  slug: string;
  titulo: string;
  resumen: string;
  contenido: string;
  categoria: string;
  tags: string;
  meta_descripcion: string;
  publicado: number;
  fecha_publicacion: Date;
  fecha_actualizacion: Date;
}

function toPost(r: PostRow): Post {
  return {
    id: r.id,
    slug: r.slug,
    titulo: r.titulo,
    resumen: r.resumen,
    contenido: r.contenido,
    categoria: r.categoria,
    tags: parseJsonArray(r.tags),
    metaDescripcion: r.meta_descripcion,
    publicado: Boolean(r.publicado),
    fechaPublicacion: toIso(r.fecha_publicacion),
    fechaActualizacion: toIso(r.fecha_actualizacion),
  };
}

export async function getPosts(soloPublicados = true): Promise<Post[]> {
  const rows = await query<PostRow>(
    `SELECT * FROM posts ${soloPublicados ? "WHERE publicado = 1" : ""} ORDER BY fecha_publicacion DESC`
  );
  return rows.map(toPost);
}

export async function getPost(slug: string): Promise<Post | undefined> {
  const rows = await query<PostRow>("SELECT * FROM posts WHERE slug = ? AND publicado = 1 LIMIT 1", [slug]);
  return rows[0] ? toPost(rows[0]) : undefined;
}

export async function getPostById(id: string): Promise<Post | undefined> {
  const rows = await query<PostRow>("SELECT * FROM posts WHERE id = ? LIMIT 1", [id]);
  return rows[0] ? toPost(rows[0]) : undefined;
}

export async function savePost(data: Partial<Post> & { titulo: string; contenido: string }): Promise<Post> {
  const existente = data.id ? await getPostById(data.id) : undefined;
  const now = new Date();

  const post: Post = {
    id: data.id || Date.now().toString(),
    slug: data.slug || slugify(data.titulo),
    titulo: data.titulo,
    resumen: data.resumen || "",
    contenido: data.contenido,
    categoria: data.categoria || "General",
    tags: data.tags || [],
    metaDescripcion: data.metaDescripcion || data.resumen || "",
    publicado: data.publicado ?? false,
    fechaPublicacion: data.fechaPublicacion || existente?.fechaPublicacion || now.toISOString(),
    fechaActualizacion: now.toISOString(),
  };

  const fechaPub = new Date(post.fechaPublicacion);
  if (!post.slug) throw new Error("No se pudo generar un slug a partir del titulo");
  if (Number.isNaN(fechaPub.getTime())) throw new Error("Fecha de publicacion invalida");

  const tags = JSON.stringify(post.tags);
  const publicado = post.publicado ? 1 : 0;

  // INSERT y UPDATE por separado (no ON DUPLICATE KEY): asi un slug repetido
  // falla con ER_DUP_ENTRY en vez de sobrescribir silenciosamente otro post.
  try {
    if (existente) {
      await execute(
        `UPDATE posts SET slug = ?, titulo = ?, resumen = ?, contenido = ?, categoria = ?, tags = ?,
           meta_descripcion = ?, publicado = ?, fecha_publicacion = ?, fecha_actualizacion = ?
         WHERE id = ?`,
        [
          post.slug, post.titulo, post.resumen, post.contenido, post.categoria, tags,
          post.metaDescripcion, publicado, fechaPub, now, post.id,
        ]
      );
    } else {
      await execute(
        `INSERT INTO posts
           (id, slug, titulo, resumen, contenido, categoria, tags, meta_descripcion, publicado, fecha_publicacion, fecha_actualizacion)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          post.id, post.slug, post.titulo, post.resumen, post.contenido, post.categoria,
          tags, post.metaDescripcion, publicado, fechaPub, now,
        ]
      );
    }
  } catch (err) {
    if ((err as { code?: string }).code === "ER_DUP_ENTRY") {
      throw new Error(`Ya existe otro post con el slug "${post.slug}"`);
    }
    throw err;
  }
  return post;
}

export async function deletePost(id: string): Promise<void> {
  await execute("DELETE FROM posts WHERE id = ?", [id]);
}

export async function getCategorias(): Promise<string[]> {
  const rows = await query<RowDataPacket & { categoria: string }>(
    "SELECT DISTINCT categoria FROM posts WHERE publicado = 1 ORDER BY categoria"
  );
  return rows.map((r) => r.categoria);
}

export async function getPostsByCategoria(categoria: string): Promise<Post[]> {
  const rows = await query<PostRow>(
    "SELECT * FROM posts WHERE publicado = 1 AND categoria = ? ORDER BY fecha_publicacion DESC",
    [categoria]
  );
  return rows.map(toPost);
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

import { getPosts } from "@/lib/blog";

const BASE_URL = "https://scraperfy.com";

function escapeXml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const posts = getPosts();

  const items = posts
    .slice(0, 20)
    .map(
      (post) => `
    <item>
      <title>${escapeXml(post.titulo)}</title>
      <link>${BASE_URL}/blog/${post.slug}</link>
      <guid isPermaLink="true">${BASE_URL}/blog/${post.slug}</guid>
      <description>${escapeXml(post.metaDescripcion || post.resumen)}</description>
      <pubDate>${new Date(post.fechaPublicacion).toUTCString()}</pubDate>
      <category>${escapeXml(post.categoria)}</category>
      ${post.tags.map((tag) => `<category>${escapeXml(tag)}</category>`).join("\n      ")}
    </item>`
    )
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Blog de Scraperfy — Web Scraping como Servicio</title>
    <link>${BASE_URL}</link>
    <description>Artículos sobre web scraping, extracción de datos, automatización y casos de uso para empresas en Perú y Latinoamérica.</description>
    <language>es-PE</language>
    <atom:link href="${BASE_URL}/feed.xml" rel="self" type="application/rss+xml"/>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    ${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
}

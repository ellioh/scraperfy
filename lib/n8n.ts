import type { Solicitud } from "@/lib/data";

/**
 * Notifica a n8n que llego una solicitud nueva (POST al webhook configurado).
 * Es opcional y nunca lanza: si n8n no esta configurado o falla, la solicitud
 * ya quedo guardada en la base de datos y el visitante no debe ver un error.
 */
export async function notificarSolicitud(solicitud: Solicitud): Promise<void> {
  const url = process.env.N8N_WEBHOOK_URL;
  if (!url) return;

  const headers: Record<string, string> = { "Content-Type": "application/json" };
  // En el nodo Webhook de n8n: Authentication = Header Auth con este mismo nombre/valor
  if (process.env.N8N_WEBHOOK_SECRET) headers["X-Scraperfy-Secret"] = process.env.N8N_WEBHOOK_SECRET;

  try {
    const res = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify({ evento: "solicitud.nueva", solicitud }),
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) console.error(`[n8n] webhook respondio ${res.status}`);
  } catch (err) {
    console.error("[n8n] no se pudo notificar la solicitud:", err instanceof Error ? err.message : err);
  }
}

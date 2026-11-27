// Worker do Saúde & Corpo: serve o app (public/) e faz o proxy da NutriData em /api/nutridata.
// A chave vem no header X-API-Key e nunca é registrada.
const J = { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" };
const out = (status, obj) => new Response(JSON.stringify(obj), { status, headers: J });

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname !== "/api/nutridata") return env.ASSETS.fetch(request);

    if (request.method !== "GET") return out(405, { success: false, error: "Método não permitido." });
    const key = request.headers.get("x-api-key");
    if (!key || !/^nd_[A-Za-z0-9_-]{20,}$/.test(key))
      return out(401, { success: false, error: "Chave NutriData ausente ou inválida." });
    const path = url.searchParams.get("path");
    if (!path || !/^\/foods\/[A-Za-z0-9/?=&%._-]+$/.test(path))
      return out(400, { success: false, error: "Caminho de consulta inválido." });
    try {
      const up = await fetch("https://api.nutritrack.me/api/v1" + path, {
        headers: { "X-API-Key": key, Accept: "application/json" },
        redirect: "error",
      });
      return new Response(await up.text(), { status: up.status, headers: J });
    } catch (err) {
      return out(502, { success: false, error: "Falha ao consultar a API NutriData pelo servidor.", detail: String(err && err.message || err) });
    }
  },
};

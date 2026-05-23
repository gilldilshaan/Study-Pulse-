import { readJson, writeJson } from "./storage.js";

function baseOrigin() {
  return window.location.origin;
}

function cacheKey(url) {
  return `cache:${url}`;
}

export async function apiFetch(path, { method = "GET", body, headers, cacheTtlMs = 60000 } = {}) {
  const url = `${baseOrigin()}${path.startsWith("/") ? path : `/${path}`}`;
  const token = readJson("sp:token", null);

  const init = {
    method,
    headers: {
      ...(body ? { "Content-Type": "application/json" } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(headers || {})
    },
    body: body ? JSON.stringify(body) : undefined
  };

  try {
    const res = await fetch(url, init);
    const data = await res.json().catch(() => null);

    if (!res.ok) {
      const err = new Error((data && data.message) || "Request failed");
      err.statusCode = res.status;
      err.data = data;
      throw err;
    }

    if (method === "GET") {
      writeJson(cacheKey(url), { at: Date.now(), data });
    }

    return data;
  } catch (err) {
    if (method === "GET") {
      const cached = readJson(cacheKey(url), null);
      if (cached && Date.now() - cached.at < cacheTtlMs) {
        return cached.data;
      }
    }
    throw err;
  }
}
import { apiFetch } from "../utils/http.js";
import { readJson, writeJson, remove } from "../utils/storage.js";

export function getSession() {
  return {
    token: readJson("sp:token", null),
    user: readJson("sp:user", null)
  };
}

export function logout() {
  remove("sp:token");
  remove("sp:user");
}

export async function register({ name, email, password }) {
  await apiFetch("/api/auth/register", {
    method: "POST",
    body: { name, email, password }
  });
}

export async function login({ email, password }) {
  const res = await apiFetch("/api/auth/login", {
    method: "POST",
    body: { email, password }
  });

  const token = res.token || (res.data && res.data.token) || null;
  const user = res.user || (res.data && res.data.user) || null;

  if (!token || !user) {
    throw new Error("Bad auth response from server");
  }

  writeJson("sp:token", token);
  writeJson("sp:user", user);
  return user;
}

export async function me() {
  const res = await apiFetch("/api/auth/me", { method: "GET" });
  const user = res.user || (res.data && res.data.user) || null;
  if (user) writeJson("sp:user", user);
  return user;
}
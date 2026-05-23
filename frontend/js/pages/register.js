import { register } from "../api/auth.api.js";
import { toast } from "../components/toast.js";

const form = document.getElementById("register-form");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const data = new FormData(form);

  const payload = {
    name: data.get("name"),
    email: data.get("email"),
    password: data.get("password")
  };

  try {
    await register(payload);
    toast({ title: "Account created", message: "Please sign in.", variant: "success", timeoutMs: 1400 });
    window.setTimeout(() => (window.location.href = "login.html"), 500);
  } catch (err) {
    toast({ title: "Register failed", message: err.message || "Try again", variant: "danger" });
  }
});
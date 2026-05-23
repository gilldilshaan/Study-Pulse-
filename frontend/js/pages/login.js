const form = document.getElementById("login-form");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const res = await fetch(`http://${location.hostname}:5000/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (!res.ok) {
      alert("Login failed");
      return;
    }

    // 🔥 DIRECT SAVE (NO IMPORT DEPENDENCY)
    localStorage.setItem("session", JSON.stringify({
      token: data.token || "demo",
      userId: data.user._id,
      name: data.user.name,
      email: data.user.email
    }));

    console.log("SESSION SAVED:", localStorage.getItem("session"));

    window.location.href = "index.html";

  } catch (err) {
    console.error(err);
    alert("Error logging in");
  }
});
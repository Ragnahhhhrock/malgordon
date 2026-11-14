import { EmailMessage } from "cloudflare:email";

const ALLOWED_ORIGINS = ["https://malgordon.com", "https://www.malgordon.com"];
const FROM = "mal@malgordon.com";
const TO = "malgordonperth@gmail.com";

function cors(origin) {
  const allow = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    "Access-Control-Allow-Origin": allow,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Vary": "Origin",
  };
}

function json(body, status, origin) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...cors(origin) },
  });
}

const clean = (s, max) => String(s ?? "").replace(/\r/g, "").slice(0, max);
const header = (s) => clean(s, 200).replace(/[\r\n]+/g, " ");

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") || "";
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: cors(origin) });
    }
    if (request.method !== "POST") return json({ ok: false, error: "method" }, 405, origin);
    if (origin && !ALLOWED_ORIGINS.includes(origin)) return json({ ok: false, error: "origin" }, 403, origin);

    let form;
    try { form = await request.formData(); } catch { return json({ ok: false, error: "bad request" }, 400, origin); }

    // Honeypot: pretend success so bots move on.
    if (form.get("_gotcha")) return json({ ok: true }, 200, origin);

    const subject = header(form.get("_subject") || "New message from malgordon.com");
    const email = header(form.get("email"));
    const name = header(form.get("name"));
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return json({ ok: false, error: "email" }, 400, origin);

    const lines = [];
    for (const [key, value] of form.entries()) {
      if (key.startsWith("_") || typeof value !== "string") continue;
      lines.push(`${key}: ${clean(value, 5000)}`);
    }
    const body = lines.join("\n\n");

    const raw = [
      `From: "malgordon.com" <${FROM}>`,
      `To: ${TO}`,
      `Reply-To: ${name ? `"${name.replace(/"/g, "")}" ` : ""}<${email}>`,
      `Subject: ${subject}`,
      `Message-ID: <${crypto.randomUUID()}@malgordon.com>`,
      `Date: ${new Date().toUTCString()}`,
      "MIME-Version: 1.0",
      "Content-Type: text/plain; charset=utf-8",
      "Content-Transfer-Encoding: 8bit",
      "",
      body,
    ].join("\r\n");

    try {
      await env.EMAIL.send(new EmailMessage(FROM, TO, raw));
    } catch (e) {
      return json({ ok: false, error: "send failed" }, 502, origin);
    }
    return json({ ok: true }, 200, origin);
  },
};

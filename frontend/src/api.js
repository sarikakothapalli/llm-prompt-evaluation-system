const API_BASE = "http://localhost:5000";

function pickText(obj) {
  if (obj == null) return "";
  if (typeof obj === "string") return obj;
  return (
    obj.text ??
    obj.response ??
    obj.content ??
    obj.output ??
    obj.message ??
    ""
  );
}

function pickTime(obj) {
  if (obj == null) return null;
  const t =
    obj.responseTime ??
    obj.response_time ??
    obj.latency_ms ??
    obj.time_ms ??
    obj.duration;
  if (t == null) return null;
  if (typeof t === "number") return t;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

function normalizeModelEntry(raw) {
  if (raw == null) return { text: "", responseTime: null };
  return {
    text: String(pickText(raw)),
    responseTime: pickTime(raw),
  };
}

const MODEL_KEYS = ["chatgpt", "claude", "gemini"];

export function normalizeEvaluateResponse(data) {
  const out = {
    chatgpt: { text: "", responseTime: null },
    claude: { text: "", responseTime: null },
    gemini: { text: "", responseTime: null },
  };
  if (!data || typeof data !== "object") return out;

  const mergeFrom = (src) => {
    if (!src || typeof src !== "object") return;
    for (const key of MODEL_KEYS) {
      if (src[key] != null) out[key] = normalizeModelEntry(src[key]);
    }
    if (src.ChatGPT != null) out.chatgpt = normalizeModelEntry(src.ChatGPT);
    if (src.Claude != null) out.claude = normalizeModelEntry(src.Claude);
    if (src.Gemini != null) out.gemini = normalizeModelEntry(src.Gemini);
  };

  mergeFrom(data);
  mergeFrom(data.results);
  mergeFrom(data.data);

  return out;
}

export async function postEvaluate(body) {
  const res = await fetch(`${API_BASE}/evaluate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const text = await res.text();
  let json = null;
  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    throw new Error(res.ok ? "Invalid JSON from /evaluate" : text || res.statusText);
  }
  if (!res.ok) {
    const msg = (json?.error ?? json?.message ?? text) || `HTTP ${res.status}`;
    throw new Error(typeof msg === "string" ? msg : "Evaluation request failed");
  }
  return normalizeEvaluateResponse(json);
}

export async function postOptimizePrompt(prompt) {
  const res = await fetch(`${API_BASE}/optimize-prompt`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt }),
  });
  const text = await res.text();
  let json = null;
  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    throw new Error(res.ok ? "Invalid JSON from /optimize-prompt" : text || res.statusText);
  }
  if (!res.ok) {
    const msg = json?.error ?? json?.message ?? text ?? `HTTP ${res.status}`;
    throw new Error(typeof msg === "string" ? msg : "Optimize request failed");
  }
  const improved =
    json?.optimized_prompt ??
    json?.optimizedPrompt ??
    json?.improved_prompt ??
    json?.improvedPrompt ??
    json?.result ??
    json?.text;
  if (improved == null || String(improved).trim() === "") {
    throw new Error("No optimized prompt in response");
  }
  return String(improved);
}

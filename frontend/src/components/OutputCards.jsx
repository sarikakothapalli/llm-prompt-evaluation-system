import { motion } from "framer-motion";

const META = {
  chatgpt: { title: "ChatGPT", accent: "from-emerald-500/30 to-teal-600/10", dot: "bg-emerald-400" },
  claude: { title: "Claude", accent: "from-amber-500/30 to-orange-600/10", dot: "bg-amber-400" },
  gemini: { title: "Gemini", accent: "from-sky-500/30 to-indigo-600/10", dot: "bg-sky-400" },
};

function formatMs(raw) {
  if (raw == null) return "—";
  let ms = Number(raw);
  if (!Number.isFinite(ms)) return "—";
  if (ms > 0 && ms < 250 && ms % 1 !== 0) ms = ms * 1000;
  if (ms >= 1000) return `${(ms / 1000).toFixed(2)} s`;
  return `${Math.round(ms)} ms`;
}

export default function OutputCards({ responses, enabled, loading }) {
  const keys = ["chatgpt", "claude", "gemini"];

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.45, delay: 0.1 }}
      className="space-y-4"
    >
      <div className="flex items-center justify-between gap-2">
        <h2 className="font-display text-sm font-semibold text-white">Model outputs</h2>
        {loading && (
          <span className="flex items-center gap-2 text-xs text-slate-500">
            <span className="h-3 w-3 animate-spin rounded-full border border-slate-600 border-t-accent" />
            Fetching…
          </span>
        )}
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        {keys.map((key, i) => {
          const m = META[key];
          const data = responses[key];
          const off = !enabled[key];
          return (
            <motion.article
              key={key}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.08 + i * 0.06 }}
              className={[
                "relative flex min-h-[220px] flex-col overflow-hidden rounded-2xl border bg-surface-800/90 shadow-panel backdrop-blur-sm",
                off ? "border-dashed border-slate-700 opacity-60" : "border-surface-border",
              ].join(" ")}
            >
              <div
                className={`pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b ${m.accent} opacity-80`}
              />
              <div className="relative flex items-center justify-between border-b border-white/5 px-4 py-3">
                <div className="flex items-center gap-2">
                  <span className={`h-2 w-2 rounded-full ${m.dot} shadow-[0_0_10px_currentColor]`} />
                  <span className="font-display text-sm font-medium text-white">{m.title}</span>
                </div>
                <span className="rounded-lg bg-surface-900/80 px-2 py-0.5 font-mono text-[10px] text-slate-400">
                  {formatMs(data?.responseTime)}
                </span>
              </div>
              <div className="relative flex-1 p-4">
                {off ? (
                  <p className="text-sm text-slate-500">Disabled for this run.</p>
                ) : loading ? (
                  <div className="flex h-full min-h-[120px] items-center justify-center">
                    <span className="h-8 w-8 animate-spin rounded-full border-2 border-slate-700 border-t-accent" />
                  </div>
                ) : (
                  <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-300">
                    {data?.text?.trim() ? data.text : "No response yet. Run an evaluation."}
                  </p>
                )}
              </div>
            </motion.article>
          );
        })}
      </div>
    </motion.section>
  );
}

import { motion } from "framer-motion";

const MODELS = [
  { id: "chatgpt", label: "ChatGPT", color: "from-emerald-500/20 to-teal-500/10" },
  { id: "claude", label: "Claude", color: "from-amber-500/20 to-orange-500/10" },
  { id: "gemini", label: "Gemini", color: "from-sky-500/20 to-blue-500/10" },
];

export default function ModelSelector({ enabled, onToggle, disabled }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.05 }}
      className="rounded-2xl border border-surface-border bg-surface-800/80 p-5 shadow-panel backdrop-blur-sm"
    >
      <div className="mb-3 flex items-center justify-between gap-2">
        <h2 className="font-display text-sm font-semibold text-white">Models</h2>
        <span className="text-xs text-slate-500">Toggle providers to include in run</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {MODELS.map((m, i) => {
          const on = enabled[m.id];
          return (
            <motion.button
              key={m.id}
              type="button"
              disabled={disabled}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.08 + i * 0.04 }}
              whileHover={disabled ? {} : { scale: 1.02 }}
              whileTap={disabled ? {} : { scale: 0.98 }}
              onClick={() => onToggle(m.id)}
              className={[
                "relative min-w-[7.5rem] flex-1 rounded-xl border px-4 py-3 text-left text-sm font-medium transition-colors",
                on
                  ? "border-accent/50 bg-gradient-to-br text-white shadow-[0_0_20px_-8px_rgba(99,102,241,0.7)] " +
                    m.color
                  : "border-surface-border bg-surface-700/40 text-slate-400 hover:border-slate-600 hover:text-slate-300",
                disabled ? "cursor-not-allowed opacity-60" : "",
              ].join(" ")}
            >
              <span className="block font-display">{m.label}</span>
              <span className="mt-0.5 block text-xs font-normal text-slate-500">
                {on ? "Included" : "Off"}
              </span>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}

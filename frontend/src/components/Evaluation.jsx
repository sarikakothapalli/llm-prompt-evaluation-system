import { motion } from "framer-motion";

const QUALITY_OPTIONS = [
  { value: "best_quality", label: "Best quality" },
  { value: "most_accurate", label: "Most accurate" },
  { value: "most_creative", label: "Most creative" },
];

const MODEL_OPTIONS = [
  { value: "chatgpt", label: "ChatGPT" },
  { value: "claude", label: "Claude" },
  { value: "gemini", label: "Gemini" },
];

function Stars({ value, onChange, disabled }) {
  return (
    <div className="flex gap-1" role="group" aria-label="Star rating 1 to 5">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          disabled={disabled}
          onClick={() => onChange(n)}
          className="rounded-md p-0.5 text-amber-400 transition-transform hover:scale-110 disabled:opacity-50"
          aria-label={`${n} star${n > 1 ? "s" : ""}`}
        >
          <svg
            className={n <= value ? "opacity-100" : "opacity-25"}
            width="26"
            height="26"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        </button>
      ))}
    </div>
  );
}

export default function Evaluation({
  evaluation,
  onChange,
  onAutoEvaluate,
  onSave,
  responses,
  saveMessage,
  disabled,
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.05 }}
      className="rounded-2xl border border-surface-border bg-surface-800/80 p-6 shadow-panel backdrop-blur-sm"
    >
      <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-sm font-semibold text-white">Human evaluation</h2>
          <p className="text-xs text-slate-500">Score the run and record your preferred model.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <motion.button
            type="button"
            onClick={() => onAutoEvaluate(responses)}
            disabled={disabled}
            whileHover={disabled ? {} : { scale: 1.02 }}
            whileTap={disabled ? {} : { scale: 0.98 }}
            className="rounded-xl border border-surface-border bg-surface-700/50 px-4 py-2 text-xs font-semibold text-slate-200 hover:border-slate-500 disabled:cursor-not-allowed disabled:opacity-45"
          >
            Auto evaluate
          </motion.button>
          <motion.button
            type="button"
            onClick={onSave}
            disabled={disabled}
            whileHover={disabled ? {} : { scale: 1.02 }}
            whileTap={disabled ? {} : { scale: 0.98 }}
            className="rounded-xl bg-white/10 px-4 py-2 text-xs font-semibold text-white ring-1 ring-white/15 hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-45"
          >
            Save evaluation
          </motion.button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-3">
          <span className="text-xs font-medium text-slate-400">Overall rating (1–5)</span>
          <Stars
            value={evaluation.stars}
            onChange={(n) => onChange({ stars: n })}
            disabled={disabled}
          />
        </div>
        <div className="space-y-2">
          <label className="block text-xs font-medium text-slate-400">Quality dimension</label>
          <select
            value={evaluation.quality}
            onChange={(e) => onChange({ quality: e.target.value })}
            disabled={disabled}
            className="w-full rounded-xl border border-surface-border bg-surface-900/60 px-4 py-2.5 text-sm text-slate-200 focus:border-accent/50 focus:outline-none focus:ring-2 focus:ring-accent/20 disabled:opacity-60"
          >
            {QUALITY_OPTIONS.map((q) => (
              <option key={q.value} value={q.value}>
                {q.label}
              </option>
            ))}
          </select>
        </div>
        <div className="md:col-span-2 space-y-2">
          <label className="block text-xs font-medium text-slate-400">Best model for this task</label>
          <div className="flex flex-wrap gap-2">
            {MODEL_OPTIONS.map((m) => {
              const active = evaluation.bestModel === m.value;
              return (
                <button
                  key={m.value}
                  type="button"
                  disabled={disabled}
                  onClick={() => onChange({ bestModel: m.value })}
                  className={[
                    "rounded-xl border px-4 py-2 text-sm font-medium transition-colors",
                    active
                      ? "border-accent/60 bg-accent/15 text-white"
                      : "border-surface-border bg-surface-700/30 text-slate-400 hover:text-slate-200",
                    disabled ? "opacity-50" : "",
                  ].join(" ")}
                >
                  {m.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {saveMessage ? (
        <p className="mt-4 text-xs text-emerald-400/90">{saveMessage}</p>
      ) : null}
    </motion.section>
  );
}

import { motion } from "framer-motion";

const TASK_TYPES = [
  { value: "general", label: "General" },
  { value: "summarization", label: "Summarization" },
  { value: "coding", label: "Coding" },
  { value: "creative", label: "Creative writing" },
  { value: "reasoning", label: "Reasoning / math" },
  { value: "classification", label: "Classification" },
];

export default function PromptInput({
  prompt,
  onPromptChange,
  taskType,
  onTaskTypeChange,
  onRun,
  loading,
  disabledRun,
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="rounded-2xl border border-surface-border bg-surface-800/80 p-6 shadow-panel backdrop-blur-sm"
    >
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="font-display text-sm font-semibold text-white">Prompt</h2>
          <p className="text-xs text-slate-500">Describe what you want the models to do.</p>
        </div>
      </div>
      <textarea
        value={prompt}
        onChange={(e) => onPromptChange(e.target.value)}
        placeholder="e.g. Summarize this article in three bullet points for executives..."
        rows={5}
        disabled={loading}
        className="mb-4 w-full resize-y rounded-xl border border-surface-border bg-surface-900/60 px-4 py-3 text-sm text-slate-200 placeholder:text-slate-600 focus:border-accent/50 focus:outline-none focus:ring-2 focus:ring-accent/20 disabled:opacity-60"
      />
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
        <label className="block flex-1 text-left">
          <span className="mb-1.5 block text-xs font-medium text-slate-400">Task type</span>
          <select
            value={taskType}
            onChange={(e) => onTaskTypeChange(e.target.value)}
            disabled={loading}
            className="w-full rounded-xl border border-surface-border bg-surface-900/60 px-4 py-2.5 text-sm text-slate-200 focus:border-accent/50 focus:outline-none focus:ring-2 focus:ring-accent/20 disabled:opacity-60"
          >
            {TASK_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </label>
        <motion.button
          type="button"
          onClick={onRun}
          disabled={disabledRun || loading}
          whileHover={disabledRun || loading ? {} : { scale: 1.02 }}
          whileTap={disabledRun || loading ? {} : { scale: 0.98 }}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-accent px-6 text-sm font-semibold text-white shadow-[0_0_24px_-6px_rgba(99,102,241,0.8)] transition-opacity hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-45"
        >
          {loading ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              Running…
            </>
          ) : (
            "Run evaluation"
          )}
        </motion.button>
      </div>
    </motion.section>
  );
}

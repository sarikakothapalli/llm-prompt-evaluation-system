import { motion } from "framer-motion";

export default function Optimizer({
  optimizedPrompt,
  onOptimize,
  loading,
  error,
  disabled,
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.08 }}
      className="rounded-2xl border border-surface-border bg-surface-800/80 p-6 shadow-panel backdrop-blur-sm"
    >
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-sm font-semibold text-white">Prompt optimization</h2>
          <p className="text-xs text-slate-500">Send your draft to the optimizer service.</p>
        </div>
        <motion.button
          type="button"
          onClick={onOptimize}
          disabled={disabled || loading}
          whileHover={disabled || loading ? {} : { scale: 1.02 }}
          whileTap={disabled || loading ? {} : { scale: 0.98 }}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-accent/40 bg-gradient-to-r from-accent/25 to-indigo-500/20 px-5 text-sm font-semibold text-white hover:border-accent/60 disabled:cursor-not-allowed disabled:opacity-45"
        >
          {loading ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              Optimizing…
            </>
          ) : (
            "Optimize prompt"
          )}
        </motion.button>
      </div>

      {error ? (
        <div className="mb-3 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {error}
        </div>
      ) : null}

      <div>
        <span className="mb-2 block text-xs font-medium text-slate-400">Improved prompt</span>
        <div className="min-h-[100px] rounded-xl border border-surface-border bg-surface-900/60 px-4 py-3">
          {optimizedPrompt ? (
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-200">
              {optimizedPrompt}
            </p>
          ) : (
            <p className="text-sm text-slate-600">Run optimization to see a refined prompt here.</p>
          )}
        </div>
      </div>
    </motion.section>
  );
}

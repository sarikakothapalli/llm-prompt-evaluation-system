import { motion } from "framer-motion";

export default function Header() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="mb-10 text-center"
    >
      <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium text-slate-400 backdrop-blur-sm">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
        Live evaluation workspace
      </div>
      <h1 className="font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">
        LLM Prompt Optimization System
      </h1>
      <p className="mx-auto mt-3 max-w-2xl text-sm text-slate-400 sm:text-base">
        Compare ChatGPT, Claude, and Gemini side by side. Score outputs, optimize prompts, and
        ship better LLM experiences—without switching tabs.
      </p>
    </motion.header>
  );
}

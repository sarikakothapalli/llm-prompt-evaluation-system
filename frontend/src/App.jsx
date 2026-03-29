import { useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "./components/Header.jsx";
import PromptInput from "./components/PromptInput.jsx";
import ModelSelector from "./components/ModelSelector.jsx";
import OutputCards from "./components/OutputCards.jsx";
import Evaluation from "./components/Evaluation.jsx";
import Optimizer from "./components/Optimizer.jsx";
import { postOptimizePrompt } from "./api.js";

const emptyResponses = () => ({
  chatgpt: { text: "", responseTime: null },
  claude: { text: "", responseTime: null },
  gemini: { text: "", responseTime: null },
});

const defaultEnabled = () => ({
  chatgpt: true,
  claude: true,
  gemini: true,
});

const defaultEvaluation = () => ({
  stars: 3,
  quality: "best_quality",
  bestModel: "chatgpt",
});

function autoEvaluateFromResponses(taskType, enabled, responses) {
  const order = ["chatgpt", "claude", "gemini"];
  const candidates = order.filter((k) => enabled[k] && responses[k]?.text?.trim());

  let bestModel = "chatgpt";

  if (candidates.length) {
    const withTime = candidates
      .map((k) => ({
        k,
        t: responses[k].responseTime,
        len: responses[k].text.trim().length,
      }))
      .filter((x) => x.t != null);

    if (withTime.length) {
      bestModel = [...withTime].sort((a, b) => a.t - b.t)[0].k;
    } else {
      bestModel = [...candidates].sort(
        (a, b) => responses[b].text.length - responses[a].text.length
      )[0];
    }
  }

  const filled = order.filter((k) => enabled[k] && responses[k]?.text?.trim()).length;
  const enabledCount = order.filter((k) => enabled[k]).length;

  let stars = 3;
  if (enabledCount === 0) stars = 1;
  else if (filled === enabledCount) stars = 5;
  else if (filled > 0) stars = 4;

  let quality = "best_quality";
  if (taskType === "reasoning" || taskType === "coding") quality = "most_accurate";
  else if (taskType === "creative") quality = "most_creative";

  return { stars, quality, bestModel };
}

export default function App() {
  const [prompt, setPrompt] = useState("");
  const [taskType, setTaskType] = useState("general");
  const [enabled, setEnabled] = useState(defaultEnabled());
  const [responses, setResponses] = useState(emptyResponses());
  const [evaluation, setEvaluation] = useState(defaultEvaluation());
  const [evalLoading, setEvalLoading] = useState(false);
  const [optimizeLoading, setOptimizeLoading] = useState(false);
  const [error, setError] = useState("");
  const [optimizeError, setOptimizeError] = useState("");
  const [optimizedPrompt, setOptimizedPrompt] = useState("");
  const [saveMessage, setSaveMessage] = useState("");

  const toggleModel = useCallback((id) => {
    setEnabled((prev) => ({ ...prev, [id]: !prev[id] }));
  }, []);

  const patchEvaluation = useCallback((patch) => {
    setEvaluation((e) => ({ ...e, ...patch }));
    setSaveMessage("");
  }, []);

  const handleAutoEvaluate = useCallback(() => {
    const next = autoEvaluateFromResponses(taskType, enabled, responses);
    setEvaluation((e) => ({ ...e, ...next }));
    setSaveMessage("");
  }, [taskType, enabled, responses]);

  const handleSaveEvaluation = useCallback(() => {
    const payload = {
      savedAt: new Date().toISOString(),
      prompt,
      taskType,
      enabled,
      evaluation,
      responses,
    };

    try {
      const key = "llm-prompt-evaluations";
      const prev = JSON.parse(localStorage.getItem(key) || "[]");
      prev.push(payload);
      localStorage.setItem(key, JSON.stringify(prev));
      setSaveMessage("Evaluation saved locally.");
      setTimeout(() => setSaveMessage(""), 4000);
    } catch {
      setSaveMessage("Could not save.");
    }
  }, [prompt, taskType, enabled, evaluation, responses]);

  // ✅ FIXED HANDLE RUN
  const handleRun = async () => {
    setEvalLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost:5000/evaluate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          prompt,
          task: taskType,
          models: ["chatgpt", "claude", "gemini"]
        })
      });

      const data = await res.json();

      const formatted = {
        chatgpt: { text: "", responseTime: null },
        claude: { text: "", responseTime: null },
        gemini: { text: "", responseTime: null }
      };

      data.forEach((item) => {
        const key = item.model.toLowerCase();
        formatted[key] = {
          text: item.response,
          responseTime: item.time_taken
        };
      });

      setResponses(formatted);

    } catch (err) {
      console.error(err);
      setError("Failed to fetch responses.");
    }

    setEvalLoading(false);
  };

  const handleOptimize = async () => {
    setOptimizeError("");
    if (!prompt.trim()) {
      setOptimizeError("Enter a prompt.");
      return;
    }

    setOptimizeLoading(true);
    setOptimizedPrompt("");

    try {
      const improved = await postOptimizePrompt(prompt.trim());
      setOptimizedPrompt(improved);
    } catch (e) {
      setOptimizeError("Optimization failed.");
    }

    setOptimizeLoading(false);
  };

  const runDisabled = !prompt.trim();

  return (
    <div className="min-h-screen bg-black text-white pb-16 pt-10">
      <div className="mx-auto max-w-5xl px-4">
        <Header />

        <AnimatePresence>
          {error && (
            <motion.div className="text-red-400 mb-4">
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <PromptInput
              prompt={prompt}
              onPromptChange={setPrompt}
              taskType={taskType}
              onTaskTypeChange={setTaskType}
              onRun={handleRun}
              loading={evalLoading}
              disabledRun={runDisabled}
            />

            <OutputCards
              responses={responses}
              enabled={enabled}
              loading={evalLoading}
            />
          </div>

          <div className="space-y-6">
            <ModelSelector
              enabled={enabled}
              onToggle={toggleModel}
            />

            <Evaluation
              evaluation={evaluation}
              onChange={patchEvaluation}
              onAutoEvaluate={handleAutoEvaluate}
              onSave={handleSaveEvaluation}
              responses={responses}
              saveMessage={saveMessage}
            />
          </div>
        </div>

        <Optimizer
          optimizedPrompt={optimizedPrompt}
          onOptimize={handleOptimize}
          loading={optimizeLoading}
          error={optimizeError}
        />
      </div>
    </div>
  );
}
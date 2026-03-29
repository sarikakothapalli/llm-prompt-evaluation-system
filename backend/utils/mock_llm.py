"""
Simulated LLM responses (no external API).

Each model returns a short, stylistically distinct answer. A random delay
of 1-2 seconds mimics network and inference latency, and we record the
actual elapsed time for the API response.
"""

import random
import time


# Normalize incoming model keys from the client
_MODEL_ALIASES = {
    "chatgpt": "ChatGPT",
    "claude": "Claude",
    "gemini": "Gemini",
}


def display_name_for_model(model_key: str) -> str:
    """Return a human-readable model label, or title-case the key if unknown."""
    key = (model_key or "").strip().lower()
    return _MODEL_ALIASES.get(key, model_key.strip() or "Unknown")


def _chatgpt_style(prompt: str, task: str) -> str:
    return (
        f'[ChatGPT-style] For task "{task}": here is a direct, step-oriented answer.\n\n'
        f"1) Restate goal: {prompt[:120]}{'...' if len(prompt) > 120 else ''}\n"
        f"2) Outline 2-3 concrete steps tailored to the task.\n"
        f"3) Add a brief checklist you can verify before shipping."
    )


def _claude_style(prompt: str, task: str) -> str:
    return (
        f'[Claude-style] I\'ll be precise and careful. Regarding "{task}":\n\n'
        f"You asked: {prompt[:160]}{'...' if len(prompt) > 160 else ''}\n\n"
        f"I'd frame the response with clear assumptions, note any ambiguities, "
        f"and prefer structured bullets over long prose so the outcome stays auditable."
    )


def _gemini_style(prompt: str, task: str) -> str:
    return (
        f"[Gemini-style] Task: {task} - compact summary + options:\n\n"
        f"- Core idea from your prompt: {prompt[:100]}{'...' if len(prompt) > 100 else ''}\n"
        f"- Option A: minimal output (fast).\n"
        f"- Option B: richer output with examples (slower to read, easier to reuse).\n"
        f"Recommendation: pick A if latency matters; B if quality bar is higher."
    )


_STYLE_BY_KEY = {
    "chatgpt": _chatgpt_style,
    "claude": _claude_style,
    "gemini": _gemini_style,
}


def simulate_response(model_key: str, prompt: str, task: str) -> tuple[str, float]:
    """
    Sleep 1-2s at random, then return (response_text, elapsed_seconds).

    Unknown model keys still get a generic simulated reply.
    """
    key = (model_key or "").strip().lower()
    delay = random.uniform(1.0, 2.0)
    t0 = time.perf_counter()
    time.sleep(delay)
    elapsed = time.perf_counter() - t0

    fn = _STYLE_BY_KEY.get(key)
    if fn:
        text = fn(prompt or "", task or "")
    else:
        text = (
            f'[Generic mock] Model "{model_key}" - task "{task}": '
            f"I would address your prompt in a neutral tone with numbered steps."
        )
    return text, elapsed


def format_duration(seconds: float) -> str:
    """Format seconds as a short string like '1.2s'."""
    return f"{seconds:.1f}s"

"""
POST /optimize-prompt — rule-based prompt improvement (no external LLM).
"""

from flask import Blueprint, jsonify, request


optimize_bp = Blueprint("optimize", __name__)


def _improve_prompt(prompt: str, task: str) -> str:
    """
    Produce a clearer prompt with role, task framing, and constraints.

    Keeps logic simple and deterministic for a beginner-friendly demo.
    """
    p = (prompt or "").strip()
    t = (task or "").strip()

    sections = [
        "You are a careful assistant. Follow the instructions exactly.",
        f"**Task type:** {t if t else '(unspecified — infer from the user goal below)'}",
        "",
        "**User goal (verbatim):**",
        p if p else "(empty — ask for clarification in your reply)",
        "",
        "**Output requirements:**",
        "- Use clear structure (short sections or bullets).",
        "- State assumptions explicitly if anything is ambiguous.",
        "- Prefer concrete steps or examples where helpful.",
        "- Keep tone professional and concise unless the task demands otherwise.",
    ]
    return "\n".join(sections)


@optimize_bp.route("/optimize-prompt", methods=["POST"])
def optimize_prompt():
    if not request.is_json:
        return jsonify({"error": "Expected Content-Type: application/json"}), 400

    data = request.get_json(silent=True)
    if data is None:
        return jsonify({"error": "Invalid or empty JSON body"}), 400

    prompt = data.get("prompt")
    task = data.get("task")

    if prompt is None or not isinstance(prompt, str):
        return jsonify({"error": "Field 'prompt' is required and must be a string"}), 400
    if task is None or not isinstance(task, str):
        return jsonify({"error": "Field 'task' is required and must be a string"}), 400

    try:
        optimized = _improve_prompt(prompt, task)
    except Exception as exc:  # noqa: BLE001
        return jsonify({"error": "Optimization failed", "detail": str(exc)}), 500

    return jsonify({"optimized_prompt": optimized}), 200

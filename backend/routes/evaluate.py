"""
POST /evaluate — simulate multi-model responses with per-model delay.
"""

from flask import Blueprint, jsonify, request

from utils.mock_llm import display_name_for_model, format_duration, simulate_response


evaluate_bp = Blueprint("evaluate", __name__)


@evaluate_bp.route("/evaluate", methods=["POST"])
def evaluate():
    """
    Body JSON: { "prompt", "task", "models": ["chatgpt", ...] }
    Returns: [ { "model", "response", "time_taken" }, ... ]
    """
    if not request.is_json:
        return jsonify({"error": "Expected Content-Type: application/json"}), 400

    data = request.get_json(silent=True)
    if data is None:
        return jsonify({"error": "Invalid or empty JSON body"}), 400

    prompt = data.get("prompt")
    task = data.get("task")
    models = data.get("models")

    if prompt is None or not isinstance(prompt, str):
        return jsonify({"error": "Field 'prompt' is required and must be a string"}), 400
    if task is None or not isinstance(task, str):
        return jsonify({"error": "Field 'task' is required and must be a string"}), 400
    if models is None or not isinstance(models, list) or not models:
        return jsonify({"error": "Field 'models' is required and must be a non-empty array"}), 400

    # Ensure every entry is a string model id
    for i, m in enumerate(models):
        if not isinstance(m, str) or not m.strip():
            return jsonify({"error": f"models[{i}] must be a non-empty string"}), 400

    results = []
    try:
        for model_key in models:
            response_text, elapsed = simulate_response(model_key, prompt, task)
            results.append(
                {
                    "model": display_name_for_model(model_key),
                    "response": response_text,
                    "time_taken": format_duration(elapsed),
                }
            )
    except Exception as exc:  # noqa: BLE001 — top-level route guard
        return jsonify({"error": "Simulation failed", "detail": str(exc)}), 500

    return jsonify(results), 200

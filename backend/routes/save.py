"""
POST /save-evaluation — append evaluation metadata to data/evaluations.json.
"""

import json
from pathlib import Path

from flask import Blueprint, jsonify, request


save_bp = Blueprint("save", __name__)

# Resolve path relative to this file so cwd does not matter
_DATA_DIR = Path(__file__).resolve().parent.parent / "data"
_EVAL_FILE = _DATA_DIR / "evaluations.json"


def _ensure_data_file():
    """Create data directory and empty JSON array if missing."""
    _DATA_DIR.mkdir(parents=True, exist_ok=True)
    if not _EVAL_FILE.exists():
        _EVAL_FILE.write_text("[]", encoding="utf-8")


def _load_evaluations():
    """Read list from disk; on corruption, return empty list and let caller fail safe."""
    _ensure_data_file()
    raw = _EVAL_FILE.read_text(encoding="utf-8")
    try:
        data = json.loads(raw)
    except json.JSONDecodeError:
        return None
    if not isinstance(data, list):
        return None
    return data


def _atomic_write_json(path: Path, payload: list) -> None:
    """Write JSON with UTF-8; use a temp file then replace for safer concurrent use."""
    tmp = path.with_suffix(".tmp")
    text = json.dumps(payload, ensure_ascii=False, indent=2)
    tmp.write_text(text + "\n", encoding="utf-8")
    tmp.replace(path)


@save_bp.route("/save-evaluation", methods=["POST"])
def save_evaluation():
    if not request.is_json:
        return jsonify({"error": "Expected Content-Type: application/json"}), 400

    data = request.get_json(silent=True)
    if data is None:
        return jsonify({"error": "Invalid or empty JSON body"}), 400

    rating = data.get("rating")
    selected_quality = data.get("selectedQuality")
    best_model = data.get("bestModel")

    if rating is None or not isinstance(rating, (int, float)):
        return jsonify({"error": "Field 'rating' is required and must be a number"}), 400
    if selected_quality is None or not isinstance(selected_quality, str):
        return jsonify({"error": "Field 'selectedQuality' is required and must be a string"}), 400
    if best_model is None or not isinstance(best_model, str):
        return jsonify({"error": "Field 'bestModel' is required and must be a string"}), 400

    entry = {
        "rating": float(rating) if isinstance(rating, float) else int(rating),
        "selectedQuality": selected_quality.strip(),
        "bestModel": best_model.strip(),
    }

    try:
        existing = _load_evaluations()
        if existing is None:
            return (
                jsonify(
                    {
                        "error": "evaluations.json is corrupt or not a JSON array; fix or delete the file",
                    }
                ),
                500,
            )
        existing.append(entry)
        _atomic_write_json(_EVAL_FILE, existing)
    except OSError as exc:
        return jsonify({"error": "Could not write evaluations file", "detail": str(exc)}), 500
    except Exception as exc:  # noqa: BLE001
        return jsonify({"error": "Failed to save evaluation", "detail": str(exc)}), 500

    return jsonify({"ok": True, "saved": entry}), 201

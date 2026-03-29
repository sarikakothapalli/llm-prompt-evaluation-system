"""
LLM Prompt Optimization & Evaluation System — Flask API entrypoint.

Run: python app.py
"""

from flask import Flask, jsonify
from flask_cors import CORS

from routes.evaluate import evaluate_bp
from routes.optimize import optimize_bp
from routes.save import save_bp


def create_app() -> Flask:
    app = Flask(__name__)
    # Allow browser clients from other origins during local development
    CORS(app)

    app.register_blueprint(evaluate_bp)
    app.register_blueprint(optimize_bp)
    app.register_blueprint(save_bp)

    @app.route("/health", methods=["GET"])
    def health():
        return jsonify({"status": "ok"}), 200

    @app.errorhandler(404)
    def not_found(_e):
        return jsonify({"error": "Not found"}), 404

    @app.errorhandler(405)
    def method_not_allowed(_e):
        return jsonify({"error": "Method not allowed"}), 405

    @app.errorhandler(500)
    def server_error(_e):
        return jsonify({"error": "Internal server error"}), 500

    return app


app = create_app()

if __name__ == "__main__":
    # debug=True is convenient for local learning; turn off in production
    app.run(host="0.0.0.0", port=5000, debug=True)

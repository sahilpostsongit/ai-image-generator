
# backend/app.py
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import os, base64, requests, threading
import replicate

# Load ENV variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# Tokens + Model
REPLICATE_API_TOKEN = os.getenv("REPLICATE_API_TOKEN")
MODEL_NAME = os.getenv("REPLICATE_MODEL", "black-forest-labs/flux-1-schnell")

if not REPLICATE_API_TOKEN:
    raise Exception("❌ REPLICATE_API_TOKEN is missing in .env")

client = replicate.Client(api_token=REPLICATE_API_TOKEN)

# Memory cache
cache = {}

# Lock to avoid hitting rate limits
lock = threading.Lock()


@app.route("/generate", methods=["POST"])
def generate():
    data = request.get_json() or {}
    prompt = data.get("prompt", "").strip()

    if not prompt:
        return jsonify({"error": "No prompt provided"}), 400

    # Cache key
    key = f"{hash(prompt)}"

    if key in cache:
        return jsonify({"images": cache[key]})

    # Avoid multiple parallel API calls
    got_lock = lock.acquire(timeout=20)
    if not got_lock:
        return jsonify({"error": "Server busy, try again"}), 429

    try:
        # Call Replicate
        try:
            output = client.run(
                MODEL_NAME,
                input={"prompt": prompt}
            )
        except Exception as e:
            return jsonify({"error": str(e)}), 500

        # Output might be list or string
        if isinstance(output, list):
            image_url = output[0]
        else:
            image_url = output

        # Download image
        img_response = requests.get(image_url, timeout=30)
        if img_response.status_code != 200:
            return jsonify({"error": "Image download failed"}), 500

        img_bytes = img_response.content
        b64 = base64.b64encode(img_bytes).decode()
        data_url = f"data:image/png;base64,{b64}"

        # Save to cache
        cache[key] = [data_url]

        return jsonify({"images": [data_url]})

    finally:
        lock.release()


# --------------------------
# ⭐ REQUIRED SERVER RUNNER
# --------------------------
if __name__ == "__main__":
    print("🚀 Backend running at http://127.0.0.1:5000")
    app.run(host="127.0.0.1", port=5000, debug=True)

from flask import Flask, request, jsonify
import sqlite3
import time
import google.generativeai as genai
import requests
import logging
import re

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)


# Initialize SQLite Database
def init_db():
    try:
        conn = sqlite3.connect("database.db")
        cursor = conn.cursor()
        cursor.execute(
            """
            CREATE TABLE IF NOT EXISTS reported_links (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                link TEXT,
                timestamp TEXT,
                username TEXT,
                ip_address TEXT
            )
        """
        )
        conn.commit()
        conn.close()
    except sqlite3.Error as e:
        logger.error(f"Error initializing database: {e}")


init_db()

# Set API Keys
GENAI_API_KEY = "AIzaSyD40gsQfI-mxCmFs6ode-PkREoKL54pLLA"
genai.configure(api_key=GENAI_API_KEY)

GOOGLE_SAFE_BROWSING_API_KEY = "AIzaSyBk4D_mMVlntpc4C_lkew7tCLvzsczL68A"


@app.route("/chat", methods=["POST"])
def chat():
    user_message = request.json.get("message")

    if not user_message:
        return jsonify({"response": "Please enter a message."})

    try:
        model = genai.GenerativeModel("gemini-2.0-flash")

        # Improved prompt for better response formatting
        prompt = f"""
        You are Cyber Buddy, an AI chatbot that provides **short, structured, and engaging** responses.  
        Use **bullet points**, **bold text**, and **clear formatting**.  

        Example:  
        **Question:** How does encryption work?  
        **Answer:**  
        - Encryption protects data by converting it into a secure format. 🔐  
        - Uses **public and private keys** for decryption.  
        - Common methods: **AES, RSA, SHA-256 hashing.**  

        Now, answer this: {user_message}
        """

        response = model.generate_content(prompt)
        bot_response = response.text.strip()

        # Convert Markdown-style bold (**bold**) to HTML bold (<strong>bold</strong>)
        bot_response = re.sub(r"\*\*(.*?)\*\*", r"<strong>\1</strong>", bot_response)

    except Exception as e:
        logger.error(f"Error generating response: {e}")
        bot_response = "⚠️ Sorry, I couldn't process your request right now. Please try again later."

    return jsonify({"response": bot_response})


@app.route("/verify", methods=["POST"])
def verify():
    link = request.json.get("link")
    if not link:
        return jsonify({"message": "No link provided for verification."})
    else:
        print(f"🔗 Link being verified: {link}")

    url = f"https://safebrowsing.googleapis.com/v4/threatMatches:find?key={GOOGLE_SAFE_BROWSING_API_KEY}"

    payload = {
        "client": {"clientId": "your-app-name", "clientVersion": "1.0"},
        "threatInfo": {
            "threatTypes": [
                "MALWARE",
                "SOCIAL_ENGINEERING",
                "UNWANTED_SOFTWARE",
                "POTENTIALLY_HARMFUL_APPLICATION",
            ],
            "platformTypes": ["ANY_PLATFORM"],
            "threatEntryTypes": ["URL"],
            "threatEntries": [{"url": link}],
        },
    }

    try:
        response = requests.post(url, json=payload)
        data = response.json()

        if "matches" in data:
            return jsonify(
                {
                    "message": "🚨 Warning! This link is unsafe and flagged by Google Safe Browsing."
                }
            )
        else:
            return jsonify({"message": "✅ This link appears to be safe."})
    except Exception as e:
        logger.error(f"Error verifying link: {e}")
        return jsonify({"message": f"⚠️ Error: Unable to verify the link. {str(e)}"})


@app.route("/report", methods=["POST"])
def report():
    link = request.json.get("link")
    username = request.json.get("username")
    ip_address = request.remote_addr
    timestamp = time.strftime("%Y-%m-%d %H:%M:%S")

    if not link:
        return jsonify({"message": "No link provided to report."})

    if not username:
        return jsonify(
            {"message": "Please provide your username before reporting a link."}
        )

    try:
        conn = sqlite3.connect("database.db")
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO reported_links (link, timestamp, username, ip_address) VALUES (?, ?, ?, ?)",
            (link, timestamp, username, ip_address),
        )
        conn.commit()
        conn.close()
    except sqlite3.Error as e:
        logger.error(f"Error reporting link: {e}")

    return jsonify(
        {"message": f"🚨 Suspicious link reported successfully by {username}!"}
    )


if __name__ == "__main__":
    app.run(debug=True)
app = Flask(__name__)

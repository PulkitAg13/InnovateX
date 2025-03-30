# 🌐 Cyber Buddy - Chrome Extension & Web Platform

Cyber Buddy is a security-focused project that combines a Google Chrome Extension and a web platform to enhance cybersecurity awareness. It leverages AI and real-time threat detection to help users stay safe online.

---

## 🚀 Features

### 🔹 Chrome Extension
- **AI Chatbot:** Uses Google Gemini API to offer AI-powered cybersecurity advice.
- **Link Verification:** Utilizes Google Safe Browsing API for real-time link safety checks.
- **Report Suspicious Links:** Allows users to report harmful links, storing them in a secure database.

### 🔹 Web Platform
- **Homepage:** Overview of Cyber Buddy's features and cybersecurity resources.
- **Chatbot Page:** Interact with the AI chatbot for personalized tips and guidance.
- **Verify Page:** Manually enter URLs for link verification.
- **Report Page:** Report potentially malicious links.
- **Resources Page:** Access educational content on cybersecurity awareness.

---

## 🛠 Technologies Used

### Frontend
- **React.js:** UI development with dynamic components.
- **Tailwind CSS:** Modern and responsive styling.
- **Chrome Extension Development:** Manifest v3, background scripts, popups.

### Backend
- **Flask:** API and server-side logic.
- **SQLite:** Database for reported links and user data.

### APIs
- **Google Gemini API:** AI-driven chatbot for cybersecurity insights.
- **Google Safe Browsing API:** Real-time URL verification.

---

## 📌 Usage Guide

1. **Chatbot:** Type a question and get AI-powered cybersecurity advice.
2. **Verify Links:** Enter a URL on the "Verify Page" or through the Chrome Extension.
3. **Report Suspicious Links:** Help improve cybersecurity by reporting harmful websites.

---

## 💡 Future Enhancements
- **User Authentication:** Track reported links and personalized settings.
- **Enhanced UI/UX:** Improve user interface for a seamless experience.
- **Advanced Threat Detection:** Integrate more AI models for better threat identification.

---

## 🏃‍♂️ Getting Started

### Prerequisites
- Node.js & npm
- Python 3.x
- Chrome Browser

### Installation
1. Clone the repository:
```bash
git clone https://github.com/username/cyber-buddy.git
```

2. Install frontend dependencies:
```bash
cd cyber-buddy/frontend
npm install
```

3. Start the frontend server:
```bash
npm start
```

4. Install backend dependencies:
```bash
cd ../backend
pip install -r requirements.txt
```

5. Start the backend server:
```bash
flask run
```

6. Load Chrome Extension:
- Go to `chrome://extensions`
- Enable Developer Mode
- Load Unpacked -> Select `cyber-buddy/extension`

You're all set! 🚀

---

## 🎉 Contributing
Contributions are welcome! Feel free to fork the repo and submit pull requests.

---

## 🛡️ License
This project is licensed under the MIT License.

---

## 🤝 Contact
For questions or feedback, reach out to [Your Name](mailto:your-email@example.com).

Stay Safe, Stay Secure!


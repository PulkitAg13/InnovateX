document.addEventListener("DOMContentLoaded", function () {
    const chatBox = document.getElementById("chat-box");
    const userInput = document.getElementById("user-input");
    const sendBtn = document.getElementById("send-btn");
    const verifyBtn = document.getElementById("verify-link-btn");
    const reportBtn = document.getElementById("report-link-btn");

    function displayMessage(sender, message, isHTML = false) {
        const msg = document.createElement("div");
        msg.style.padding = "8px";
        msg.style.margin = "5px 0";
        msg.style.borderRadius = "5px";

        msg.style.boxShadow = "0px 2px 8px rgba(0, 0, 0, 0.1)";
        msg.style.background = sender === "Bot" ? "#e1f5fe" : "#c8e6c9";
        msg.style.maxWidth = "90%";
        msg.style.whiteSpace = "pre-wrap";
        msg.style.lineHeight = "1.6";
        msg.style.fontFamily = "Arial, sans-serif";

        // Proper Markdown-like formatting
        if (isHTML) {
            msg.innerHTML = message
                .replace(/^\s*\*\s+(.*)/gm, "<li>$1</li>")                 // Convert list items
                .replace(/(<li>.*<\/li>)(?!<\/ul>)/g, "<ul>$1</ul>")      // Wrap list items in <ul>
                .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")         // Bold
                .replace(/\*(.*?)\*/g, "<em>$1</em>")                    // Italics
                .replace(/__(.*?)__/g, "<strong>$1</strong>")            // Bold (underscores)
                .replace(/_(.*?)_/g, "<em>$1</em>")                      // Italics (underscores)
                .replace(/\n/g, "<br>");                                // Newlines
        } else {
            msg.textContent = `${sender}: ${message}`;
        }

        chatBox.appendChild(msg);
        chatBox.scrollTop = chatBox.scrollHeight;
    }


    const tipExplanations = {
        "Never share your passwords online.": "🔑 Your password is like a key to your home. If shared, anyone can access your personal data! Always keep it secret and use a password manager.",
        "Beware of phishing emails with suspicious links.": "📧 Phishing emails trick you into clicking malicious links. Always check the sender's email and hover over links before clicking!",
        "Always check if a website URL is secure (🔒 HTTPS).": "🌐 HTTPS ensures a secure connection between you and the website. If a site only shows HTTP, it may be unsafe to enter sensitive information.",
        "Use a strong and unique password for each account.": "🛡️ Using the same password everywhere is dangerous! Hackers can break into all your accounts if one password leaks. Use unique, strong passwords."
    };

    // Retrieve stored cyber awareness tip
    chrome.storage.local.get("currentTip", (data) => {
        if (data.currentTip) {
            const tip = data.currentTip;
            displayMessage("Bot", `🔹 Awareness Tip: ${tip}`);
            setTimeout(() => {
                if (tipExplanations[tip]) {
                    displayMessage("Bot", `💡 Explanation: ${tipExplanations[tip]}`);
                } else {
                    displayMessage("Bot", "⚠️ No additional explanation available.");
                }
            }, 2000);
        }
    });

    // Handling user input
    sendBtn.addEventListener("click", function () {
        const message = userInput.value.trim();
        if (message) {
            displayMessage("You", message);
            fetch("http://127.0.0.1:5000/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message })
            })
                .then(response => response.json())
                .then(data => displayMessage("Bot", data.response))
                .catch(() => displayMessage("Bot", "Error connecting to server."));
        }
        userInput.value = "";
    });

    // Enter key support
    userInput.addEventListener("keypress", function (event) {
        if (event.key === "Enter") {
            sendBtn.click();
        }
    });

    // Link verification
    verifyBtn.addEventListener("click", function () {
        const link = prompt("Enter the link to verify:").trim();
        if (link && /^https?:\/\/[\w.-]+(?:\.[\w.-]+)+[\w\-\._~:/?#[\]@!$&'()*+,;=.]+$/i.test(link)) {
            fetch("http://127.0.0.1:5000/verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ link })
            })
                .then(response => response.json())
                .then(data => displayMessage("Bot", data.message))
                .catch(() => displayMessage("Bot", "Verification failed."));
        } else {
            displayMessage("Bot", "❌ Invalid or empty link.");
        }
    });

    // Link reporting
    reportBtn.addEventListener("click", function () {
        const link = prompt("Enter the suspicious link:").trim();
        if (link && /^https?:\/\/[\w.-]+(?:\.[\w.-]+)+[\w\-\._~:/?#[\]@!$&'()*+,;=.]+$/i.test(link)) {
            const username = prompt("Enter your username:").trim();
            if (username) {
                fetch("http://127.0.0.1:5000/report", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ link, username })
                })
                    .then(response => response.json())
                    .then(data => displayMessage("Bot", data.message))
                    .catch(() => displayMessage("Bot", "Reporting failed."));
            } else {
                displayMessage("Bot", "❌ Reporting cancelled: Username is required.");
            }
        } else {
            displayMessage("Bot", "❌ Invalid or empty link.");
        }
    });
});



// document.addEventListener("DOMContentLoaded", function () {
//     const chatBox = document.getElementById("chat-box");
//     const userInput = document.getElementById("user-input");
//     const sendBtn = document.getElementById("send-btn");
//     const verifyBtn = document.getElementById("verify-link-btn");
//     const reportBtn = document.getElementById("report-link-btn");

//     function appendMessage(sender, message) {
//         const msg = document.createElement("div");
//         msg.textContent = sender + ": " + message;
//         msg.style.padding = "8px";
//         msg.style.margin = "5px 0";
//         msg.style.borderRadius = "5px";
//         msg.style.background = sender === "Bot" ? "#e1f5fe" : "#c8e6c9";
//         chatBox.appendChild(msg);
//         chatBox.scrollTop = chatBox.scrollHeight;
//     }

//     // 🔥 Predefined explanations for each tip
//     const tipExplanations = {
//         "Never share your passwords online.":
//             "🔑 Your password is like a key to your home. If shared, anyone can access your personal data! Always keep it secret and use a password manager.",
//         "Beware of phishing emails with suspicious links.":
//             "📧 Phishing emails trick you into clicking malicious links. Always check the sender's email and hover over links before clicking!",
//         "Always check if a website URL is secure (🔒 HTTPS).":
//             "🌐 HTTPS ensures a secure connection between you and the website. If a site only shows HTTP, it may be unsafe to enter sensitive information.",
//         "Use a strong and unique password for each account.":
//             "🛡️ Using the same password everywhere is dangerous! Hackers can break into all your accounts if one password leaks. Use unique, strong passwords."
//     };

//     // ✅ Function to display messages in the chatbox
//     function displayMessage(message, sender = "bot") {
//         const messageDiv = document.createElement("div");
//         messageDiv.classList.add("message");
//         messageDiv.classList.add(sender === "bot" ? "bot-message" : "user-message");
//         messageDiv.textContent = message;
//         chatBox.appendChild(messageDiv);
//         chatBox.scrollTop = chatBox.scrollHeight; // Auto-scroll
//     }

//     // ✅ Retrieve stored cyber awareness tip and explain it
//     chrome.storage.local.get("currentTip", (data) => {
//         if (data.currentTip) {
//             const tip = data.currentTip;
//             displayMessage(`🔹 Awareness Tip: ${tip}`); // Show the tip
//             setTimeout(() => {
//                 if (tipExplanations[tip]) {
//                     displayMessage(`💡 Explanation: ${tipExplanations[tip]}`); // Show explanation
//                 } else {
//                     displayMessage("⚠️ No additional explanation available.");
//                 }
//             }, 2000); // Small delay for a chatbot-like effect
//         }
//     });

//     // ✅ User input handling (for chatbot commands)
//     document.getElementById("send-btn").addEventListener("click", function () {
//         const userInput = document.getElementById("user-input").value.trim();
//         if (userInput) {
//             displayMessage(userInput, "user"); // Show user message
//             document.getElementById("user-input").value = ""; // Clear input
//             setTimeout(() => displayMessage("Processing request... 🔄", "bot"), 500);
//         }
//     });

//     // Add enter key support
//     userInput.addEventListener("keypress", function (event) {
//         if (event.key === "Enter") {
//             sendBtn.click();
//         }
//     });

//     // appendMessage("Bot", "Hi, I am your Cyber Buddy. How can I help you?");

//     sendBtn.addEventListener("click", function () {
//         const message = userInput.value.trim();
//         if (message) {
//             appendMessage("You", message);
//             fetch("http://127.0.0.1:5000/chat", {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify({ message })
//             })
//                 .then(response => response.json())
//                 .then(data => appendMessage("Bot", data.response))
//                 .catch(() => appendMessage("Bot", "Error connecting to server."));
//         }
//         userInput.value = "";
//     });

//     verifyBtn.addEventListener("click", function () {
//         const link = prompt("Enter the link to verify:");
//         if (link) {
//             fetch("http://127.0.0.1:5000/verify", {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify({ link })
//             })
//                 .then(response => response.json())
//                 .then(data => appendMessage("Bot", data.message))
//                 .catch(() => appendMessage("Bot", "Verification failed."));
//         }
//     });

//     reportBtn.addEventListener("click", function () {
//         const link = prompt("Enter the suspicious link:");
//         if (link) {
//             const username = prompt("Enter your username:");  // 🔹 Ask for username every time
//             if (username) {
//                 fetch("http://127.0.0.1:5000/report", {
//                     method: "POST",
//                     headers: { "Content-Type": "application/json" },
//                     body: JSON.stringify({ link, username })  // 🔹 Send username along with the link
//                 })
//                     .then(response => response.json())
//                     .then(data => appendMessage("Bot", data.message))
//                     .catch(() => appendMessage("Bot", "Reporting failed."));
//             } else {
//                 appendMessage("Bot", "❌ Reporting cancelled: Username is required.");
//             }
//         }
//     });

// });





// document.addEventListener("DOMContentLoaded", function () {
//     const chatBox = document.getElementById("chat-box");
//     const userInput = document.getElementById("user-input");
//     const sendBtn = document.getElementById("send-btn");
//     const verifyBtn = document.getElementById("verify-link-btn");
//     const reportBtn = document.getElementById("report-link-btn");

//     const threatLevel = document.getElementById("threat-level");
//     const connectionStatus = document.getElementById("connection-status");

//     // Tip explanations from your second JS file
//     const tipExplanations = {
//         "Never share your passwords online.":
//             "🔑 Your password is like a key to your home. If shared, anyone can access your personal data! Always keep it secret and use a password manager.",
//         // Add other tips as needed
//     };

//     // Unified function to display messages
//     function displayMessage(message, sender = "bot") {
//         const messageDiv = document.createElement("div");
//         messageDiv.classList.add("message");
//         messageDiv.classList.add(sender === "bot" ? "bot-message" : "user-message");
//         messageDiv.textContent = message;
//         chatBox.appendChild(messageDiv);
//         chatBox.scrollTop = chatBox.scrollHeight; // Auto-scroll
//     }

//     // Add enter key support
//     userInput.addEventListener("keypress", function (event) {
//         if (event.key === "Enter") {
//             sendBtn.click();
//         }
//     });

//     // Handle send button
//     sendBtn.addEventListener("click", function () {
//         const message = userInput.value.trim();
//         if (message) {
//             displayMessage(message, "user");
//             userInput.value = "";
//             connectionStatus.innerHTML = "Connection: <span style='color:#ffd700'>Processing...</span>";

//             fetch("http://127.0.0.1:5000/chat", {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify({ message })
//             })
//                 .then(response => {
//                     if (!response.ok) throw new Error("Server error");
//                     return response.json();
//                 })
//                 .then(data => {
//                     displayMessage(data.response);
//                     connectionStatus.innerHTML = "Connection: <span style='color:#00ff00'>Secure</span>";
//                 })
//                 .catch((error) => {
//                     displayMessage("⚠️ Error: " + (error.message || "Failed to connect to server."));
//                     connectionStatus.innerHTML = "Connection: <span style='color:#ff004c'>Error</span>";
//                 });
//         }
//     });

//     // Load stored cyber awareness tip
//     try {
//         chrome.storage.local.get("currentTip", (data) => {
//             if (data && data.currentTip) {
//                 const tip = data.currentTip;
//                 displayMessage(`🔹 Awareness Tip: ${tip}`);
//                 setTimeout(() => {
//                     if (tipExplanations[tip]) {
//                         displayMessage(`💡 Explanation: ${tipExplanations[tip]}`);
//                     }
//                 }, 1500);
//             }
//         });
//     } catch (e) {
//         console.log("Chrome storage not available in development mode");
//     }

//     // Handle verify button with improved error handling
//     verifyBtn.addEventListener("click", function () {
//         const link = prompt("Enter the link to verify:");
//         if (link) {
//             threatLevel.innerHTML = "Threat Level: <span style='color:#ffd700'>Scanning...</span>";

//             fetch("http://127.0.0.1:5000/verify", {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify({ link })
//             })
//                 .then(response => {
//                     if (!response.ok) throw new Error("Verification server error");
//                     return response.json();
//                 })
//                 .then(data => {
//                     displayMessage(data.message);
//                     threatLevel.textContent = "Threat Level: Low";
//                 })
//                 .catch((error) => {
//                     displayMessage("⚠️ Verification failed: " + (error.message || "Unknown error"));
//                     threatLevel.innerHTML = "Threat Level: <span style='color:#ff004c'>Error</span>";
//                 });
//         }
//     });

//     // Similar improvement for report button
//     reportBtn.addEventListener("click", function () {
//         const link = prompt("Enter the suspicious link:");
//         if (link) {
//             const username = prompt("Enter your username:");
//             if (username) {
//                 threatLevel.innerHTML = "Threat Level: <span style='color:#ffd700'>Reporting...</span>";

//                 fetch("http://127.0.0.1:5000/report", {
//                     method: "POST",
//                     headers: { "Content-Type": "application/json" },
//                     body: JSON.stringify({ link, username })
//                 })
//                     .then(response => {
//                         if (!response.ok) throw new Error("Reporting server error");
//                         return response.json();
//                     })
//                     .then(data => {
//                         displayMessage(data.message);
//                         threatLevel.textContent = "Threat Level: Low";
//                     })
//                     .catch((error) => {
//                         displayMessage("⚠️ Reporting failed: " + (error.message || "Unknown error"));
//                         threatLevel.innerHTML = "Threat Level: <span style='color:#ff004c'>Error</span>";
//                     });
//             } else {
//                 displayMessage("❌ Reporting cancelled: Username is required.");
//             }
//         }
//     });

//     // ✅ User input handling (for chatbot commands)
//     document.getElementById("send-btn").addEventListener("click", function () {
//         const userInput = document.getElementById("user-input").value.trim();
//         if (userInput) {
//             displayMessage(userInput, "user"); // Show user message
//             document.getElementById("user-input").value = ""; // Clear input
//             setTimeout(() => displayMessage("Processing request... 🔄", "bot"), 500);
//         }
//     });
// });
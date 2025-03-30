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
    
        let fullMessage = message;
        let shortMessage = message.split("\n").slice(0, 3).join("\n"); // Show only first 3 lines
    
        if (isHTML) {
            shortMessage = shortMessage.replace(/\n/g, "<br>");
            fullMessage = fullMessage.replace(/\n/g, "<br>");
        }
    
        msg.innerHTML = `${sender}: <span class="msg-content">${shortMessage}</span>`;
    
        if (message.split("\n").length > 3) {
            const readMore = document.createElement("span");
            readMore.textContent = " [Read More]";
            readMore.style.color = "blue";
            readMore.style.cursor = "pointer";
            readMore.style.fontWeight = "bold";
            readMore.onclick = function () {
                msg.innerHTML = `${sender}: ${fullMessage}`;
            };
            msg.appendChild(readMore);
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


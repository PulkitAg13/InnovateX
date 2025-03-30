chrome.runtime.onInstalled.addListener(() => {
    console.log("Cyber Awareness Chatbot Extension Installed!");

    // 🔥 Set an alarm that triggers every 15 seconds for testing
    chrome.alarms.create("cyberAwareness", { periodInMinutes: 0.25 }); // 15 seconds

    // 🔥 Store initial tip in storage
    chrome.storage.local.set({ currentTip: "🔒 Stay safe! Don't click on suspicious links." });

    // 🔥 Immediate first notification (for testing)
    chrome.alarms.create("cyberAwareness", { when: Date.now() + 5000 }); 
});

// 🚀 Listen for the alarm and show a notification
chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === "cyberAwareness") {
        const tips = [
            "Never share your passwords online.",
            "Beware of phishing emails with suspicious links.",
            "Always check if a website URL is secure (🔒 HTTPS).",
            "Use a strong and unique password for each account."
        ];

        // Pick a random tip
        const randomTip = tips[Math.floor(Math.random() * tips.length)];
        
        // Store the tip so popup.js can access it later
        chrome.storage.local.set({ currentTip: randomTip });

        chrome.notifications.create("cyberAwareness", {
            type: "basic",
            iconUrl: "icon.png",  // ✅ Ensure this file exists!
            title: "Cyber Awareness Tip",
            message: randomTip,
            priority: 2,
            buttons: [{ title: "Learn More" }]
        });
    }
});

// 🎯 Open chatbot when user clicks "Learn More"
chrome.notifications.onButtonClicked.addListener((notificationId, buttonIndex) => {
    if (notificationId === "cyberAwareness" && buttonIndex === 0) {
        chrome.tabs.create({ url: chrome.runtime.getURL("popup.html") });
    }
});
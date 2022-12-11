// Pass document body to background script for preliminary detection on load
let isDetectionEnabled = false;
document.onreadystatechange = () => {
    if (document.readyState === "complete") {
        console.log("[ariadne] Document is ready");
        (async () => {
            const response = await chrome.runtime.sendMessage({
                action: "detection",
                args: {
                    body: document.body
                }
            });
            console.log('live from the background script: "' + response + '"');
        })();
    }
};

// Receive messages from background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log('this is ariadne. you switched to this tab and i am now in it');
    if (request.action === "on_focus") {
        console.log("received on_focus request from background script");
        (async () => {
            const response = await chrome.runtime.sendMessage({
                action: "updateBadge",
                args: {
                    enabled: isDetectionEnabled
                }
            });
            console.log('live from the background script: "' + response + '"');
        })();
    }
});

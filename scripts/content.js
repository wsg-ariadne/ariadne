// Receive messages from background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log('this is ariadne. you switched to this tab and i am now in it');
    if (request.action === "on_focus") {
        console.log("received on_focus request from background script");
        // Look for occurrences of the word "cookies" and enable detection if found
        const text = document.body.textContent;
        const cookiesRegExp = /cookies/gi;
        if (text.match(cookiesRegExp)) {
            (async () => {
                const response = await chrome.runtime.sendMessage({action: "enable_detection"});
                console.log('live from the background script: "' + response + '"');
            })();
        } else {
            (async () => {
                const response = await chrome.runtime.sendMessage({action: "disable_detection"});
                console.log('live from the background script: "' + response + '"');
            })();
        }
    }
});

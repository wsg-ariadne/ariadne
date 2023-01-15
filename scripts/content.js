// Pass document body to background script for preliminary detection on load
let isDetectionEnabled = false;
let bannerDiv = null;
document.onreadystatechange = () => {
    // Look for floating divs, i.e. divs with position: fixed|absolute|sticky
    // and a z-index > 0
    const floatingDivs = [...document.body.getElementsByTagName("div")];
    floatingDivs.filter((div) => {
        const computedStyle = window.getComputedStyle(div);
        const position = computedStyle.position;
        return computedStyle.zIndex > 0 && (position === "fixed" || position === "absolute" || position === "sticky");
    });
    console.log("found floating divs", floatingDivs);

    // Look for the words "cookies", "consent", or "trackers" in the div's text
    for (let i = 0; i < floatingDivs.length; i++) {
        const divText = floatingDivs[i].innerText.toLowerCase();
        if (divText.includes("cookies") || divText.includes("consent") || divText.includes("trackers")) {
            isDetectionEnabled = true;
            bannerDiv = floatingDivs[i];
            
            // Send div text to background script for detection
            (async () => {
                const response = await chrome.runtime.sendMessage({
                    action: "detection",
                    args: {
                        body: divText
                    }
                });
                console.log('live from the background script: "' + response + '"');
            })();
            break;
        }
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
    
    return true;
});

// Pass document body to background script for preliminary detection on load
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
            bannerDiv = floatingDivs[i];
            
            // Send div text to background script for detection
            (async () => {
                await chrome.runtime.sendMessage({
                    action: "detection",
                    args: {
                        body: divText,
                        url: window.location.href
                    }
                });
            })();
            break;
        }
    }
};

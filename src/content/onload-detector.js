import html2canvas from 'html2canvas';

let bannerDiv = null;
function performDetection() {
    // Look for floating divs, i.e. divs with position: fixed|absolute|sticky
    // and a z-index > 0
    const floatingDivs = [...document.body.getElementsByTagName("div")];
    floatingDivs.filter((div) => {
        let computedStyle = window.getComputedStyle(div);
        if (computedStyle === "auto") { computedStyle = 0; }
        const position = computedStyle.position;
        return computedStyle.zIndex > 0 && (position === "fixed" || position === "absolute" || position === "sticky");
    });
    console.log("[content] Found " + floatingDivs.length + " floating divs");

    // Look for the words "cookies", "consent", or "trackers" in the div's text
    for (let i = 0; i < floatingDivs.length; i++) {
        const divText = floatingDivs[i].innerText.toLowerCase();
        if (divText.includes("cookies") || divText.includes("consent") || divText.includes("trackers")) {
            bannerDiv = floatingDivs[i];
            console.log("[content] Found banner div:", bannerDiv);
            
            // Send div text to background script for detection
            (async () => {
                await chrome.runtime.sendMessage({
                    action: "detection",
                    args: {
                        body: divText,
                        url: window.location.href
                    }
                }, (response) => {
                    console.log("[content] isGood result from Calliope API:", response);

                    // Update badge
                    return chrome.runtime.sendMessage({
                        action: "updateBadge",
                        args: {
                            enabled: !response
                        }
                    });
                });
            })();
            break;
        }
    }

    // No banner found
    if (bannerDiv === null) {
        console.log("[content] No banner found");

        // Take screenshot of viewport
        html2canvas(document.body, {
            x: window.scrollX,
            y: window.scrollY,
            width: window.innerWidth,
            height: window.innerHeight,
        }).then((canvas) => {
            const screenshot = canvas.toDataURL("image/png");
            console.log("[content] Screenshot taken, sending to service worker");

            // Send screenshot to service worker for detection
            return chrome.runtime.sendMessage({
                action: "visualDetection",
                args: { screenshot }
            }, (response) => {
                console.log("[content] isGood result from Calliope API:", response);

                // Update badge
                return chrome.runtime.sendMessage({
                    action: "updateBadge",
                    args: {
                        enabled: !response
                    }
                });
            });
        });
        return;
    }
}

// Wait for DOM to load
document.onreadystatechange = () => {
    if (document.readyState !== "complete") { return; }

    // Wait for 5 sec
    console.log("[content] DOM is now ready, waiting for 5 sec before performing detection");
    setTimeout(performDetection, 5000);
};
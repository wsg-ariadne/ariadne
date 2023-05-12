import html2canvas from 'html2canvas';
import * as browser from 'webextension-polyfill';

function canvasHandler(canvas) {
    const screenshot = canvas.toDataURL("image/png");
    console.log("[content] Screenshot taken, sending to service worker");

    // Send screenshot to service worker for detection
    browser.runtime.sendMessage({
        action: "visualDetection",
        args: { screenshot }
    })
        .then((response) => {
            console.log("[content] Result from Janus API:", response);

            // Update badge
            return browser.runtime.sendMessage({
                action: "updateBadge",
                args: {
                    enabled: response["classification"] == "weighted"
                }
            });
        });
}

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
            browser.runtime.sendMessage({
                action: "detection",
                args: {
                    body: divText,
                    url: window.location.href
                }
            })
                .then((response) => {
                    console.log("[content] isGood result from Calliope API:", response);

                    // Update badge
                    return browser.runtime.sendMessage({
                        action: "updateBadge",
                        args: {
                            enabled: !response.is_good
                        }
                    });
                })
                .then((response) => {
                    console.log("[content] Badge updated:", response);
                });
                
            break;
        }
    }

    // Perform visual detection
    if (bannerDiv !== null) {
        console.log("[content] Taking screenshot of banner");
        html2canvas(bannerDiv).then(canvasHandler);
    } else {
        console.log("[content] No banner div found, skipping visual detection");
    }
}

// Wait for DOM to load
document.onreadystatechange = () => {
    if (document.readyState !== "complete") { return; }

    // Call Report API for stats
    browser.runtime.sendMessage({
        action: "requestStats",
        args: { url: window.location.href }
    }).then((response) => {
        console.log("[content] Stats result from Dionysus API:", response);
    });

    // Wait for 5 sec
    console.log("[content] DOM is now ready, waiting for 5 sec before performing detection");
    setTimeout(performDetection, 5000);
};
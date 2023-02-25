let detectionResult = false;

document.onreadystatechange = () => {
  console.log('[kurzgesagt] document ready state changed to: ' + document.readyState);

  // Wait 5 seconds for the cookie banner to appear
  if (document.readyState === 'complete') {
    setTimeout(() => {
      console.log('[kurzgesagt] 5 seconds have passed, checking for cookie banner');

      // Get cookie banner div
      let cookieBanner = document.body.querySelector('div#usercentrics-root');
      let cookieBannerRoot = cookieBanner && cookieBanner.shadowRoot;
      let cookieBannerText = cookieBannerRoot.querySelector('#uc-show-more div').innerText;
      console.log('[kurzgesagt] cookie banner text: ' + cookieBannerText);
    
      // Send to background script for detection
      (async () => {
        await chrome.runtime.sendMessage({
          action: 'detection',
          args: {
            body: cookieBannerText,
            url: window.location.href
          }
        });
      })();
    }, 5000);
  }
};

// Listen for messages from background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "detectionResult") {
    console.log('[kurzgesagt] live from the background script:', request);
    detectionResult = request.args.result;

    // Also send the result to the popup
    chrome.runtime.sendMessage({
      action: 'updateBadge',
      args: {
        enabled: detectionResult
      }
    });
  }
});

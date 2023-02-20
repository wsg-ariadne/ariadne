let detectionResult = false;

document.onreadystatechange = () => {
  console.log('[inquirer.net] document ready state changed to: ' + document.readyState);

  // Wait 5 seconds for the cookie banner to appear
  if (document.readyState === 'complete') {
    setTimeout(() => {
      console.log('[inquirer.net] 5 seconds have passed, checking for cookie banner');

      // Get cookie banner div
      let cookieBannerText = document.body.querySelector('div.qni-cookmsg p').innerText;
      console.log('[inquirer.net] cookie banner text: ' + cookieBannerText);
    
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
    console.log('[inquirer.net] live from the background script:', request);
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

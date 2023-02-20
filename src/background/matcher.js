// Listen to detection requests from content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('[matcher] Received message from tab', sender.tab.id, 'with action:', request.action);

  if (request.action === "detection") {
    const cookieBannerText = request.args.body;
    console.log('[matcher] Detection request received from tab', sender.tab.id, 'with body:', cookieBannerText);
    
    // Right now we aren't using the ML model for detection yet,
    // so just return true or false randomly
    const detectionResult = Math.random() > 0.5;
    chrome.tabs.sendMessage(sender.tab.id, {
      action: 'detectionResult',
      args: {
        result: detectionResult
      }
    });
    console.log('[matcher] Detection result sent to tab', sender.tab.id, 'with result:', detectionResult);
  }
});

// Listen to detection requests from content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "detection") {
    const cookieBannerText = request.args.body;
    console.log('[matcher] Detection request received from tab', sender.tab.id, 'with body:', cookieBannerText);
    
    // POST to API
    const detectionResult = fetch('https://ariadne.dantis.me/api/v1/classify/text', {
      method: 'POST',
      body: JSON.stringify({
        text: cookieBannerText
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then((response) => {
      return response.json();
    }).then((data) => {
      console.log('[matcher] Detection result from API:', data);
      const result = data.result;

      // Send result
      sendResponse(result);
      console.log('[matcher] Detection result sent to tab', sender.tab.id, 'with result:', result);
    });
  }

  return true;
});

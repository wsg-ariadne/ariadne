const API_BASE_URL = 'https://ariadne.dantis.me/api/v1';

// Listen to detection requests from content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('[matcher] Received message from tab', sender.tab.id, 'with action:', request.action);
  console.log('API_BASE_URL', API_BASE_URL);

  if (request.action === "detection") {
    const cookieBannerText = request.args.body;
    console.log('[matcher] Detection request received from tab', sender.tab.id, 'with body:', cookieBannerText);
    
    // POST to API
    const detectionResult = fetch(API_BASE_URL + '/classify/text', {
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

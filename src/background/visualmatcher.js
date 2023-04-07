// Listen to visual detection requests from content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "visualDetection") {
    const imageData = request.args.screenshot;
    console.log('[visualmatcher] Detection request received from tab', sender.tab.id);
    
    // POST to API
    const detectionResult = fetch('https://ariadne.dantis.me/api/v1/classify/image', {
      method: 'POST',
      body: JSON.stringify({
        text: imageData
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then((response) => {
      return response.json();
    }).then((data) => {
      console.log('[visualmatcher] Detection result from API:', data);
      const result = data.result;

      // Send result
      sendResponse(result);
      console.log('[visualmatcher] Detection result sent to tab', sender.tab.id, 'with result:', result);
    });
  }

  return true;
});

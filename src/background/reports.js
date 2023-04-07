// Cache for stats for every tab
const tabStats = {};

// Listen to onloadStats requests
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action !== "requestStats") { return; }
    console.log("[stats] Received stats request from popup", request, sender);

    // If we have cached stats, send them
    const tabUrl = request.args.url;
    if (tabStats[tabUrl]) {
      console.log("[stats] Sending cached stats to tab", tabUrl, tabStats[tabUrl]);
      sendResponse(tabStats[tabUrl]);
      return;
    }
    
    // Call Report API
    fetch('http://localhost:5000/api/v1/reports/by-url', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        'page_url': tabUrl
      })
    })
      .then(response => response.json())
      .then(data => {
        console.log('[stats] Stats result from API:', data);
        
        // Save result to cache
        tabStats[tabUrl] = data;
        sendResponse(data);
      })
      .catch((error) => {
        console.error('Error:', error);

        // Reply with dummy data
        sendResponse({
          "general_reports": {
            "count": 0,
            "last_report_timestamp": null
          },
          "specific_reports": {
            "by_type": {
              "other": 0,
              "prefilled_options": 0,
              "unclear_language": 0,
              "weighted_options": 0
            },
            "count": 0,
            "last_report_timestamp": null
          },
          "success": false
        });
      }
    );
});
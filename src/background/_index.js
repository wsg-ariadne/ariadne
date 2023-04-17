class AriadneBackground {
  constructor() {
    this._tabStates = [];
    this._reportStats = {};
    this._API_URL = 'https://ariadne.dantis.me/api/v1';

    // Determine if running in unpacked mode
    const that = this;
    chrome.management.get(chrome.runtime.id, function (extensionInfo) {
      if (extensionInfo.installType === 'development') {
        console.log('[sw] Running in development mode');
        that._API_URL = 'http://localhost:5000/api/v1';
      }
      that.addListeners();
    });
  }

  addListeners() {
    // Update badge on tab change
    chrome.tabs.onActivated.addListener((activeInfo) => {
      // Get URL of active tab
      chrome.tabs.get(activeInfo.tabId, (tab) => {
        console.log('[sw] Tab changed to', tab.url);
        this.toggleBadge(this._tabStates[activeInfo.tabId]);
        this.updateBadgeText(this._reportStats[tab.url]);
      });
    });

    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      console.log("[sw] Received message with action", request.action);
      if (request.action === "updateBadge") {
        // Listen to updateBadge requests
        this.toggleBadge(request.args.enabled);

        // Update the tab state
        this._tabStates[sender.tab.id] = request.args.enabled;
      } else if (request.action === "detection") {
        // Listen to detection requests from content scripts
        const cookieBannerText = request.args.body;
        console.log('[sw] Detection request received from tab', sender.tab.id, 'with body:', cookieBannerText);
        
        // POST to API
        const detectionResult = fetch(this._API_URL + '/classify/text', {
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
          console.log('[sw] Detection result from API:', data);
          const result = data.result;

          // Send result
          sendResponse(result);
          console.log('[sw] Detection result sent to tab', sender.tab.id, 'with result:', result);
        });
      } else if (request.action === "visualDetection") {
        // Listen to visual detection requests from content scripts
        const imageData = request.args.screenshot;
        console.log('[sw] Detection request received from tab', sender.tab.id);
        
        // POST to API
        const detectionResult = fetch(this._API_URL + '/classify/image', {
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
          console.log('[sw] Detection result from API:', data);
          const result = data.result;

          // Send result
          sendResponse(result);
          console.log('[sw] Detection result sent to tab', sender.tab.id, 'with result:', result);
        });
      } else if (request.action === "requestStats") {
        console.log("[sw] Received stats request from popup", request, sender);

        // If we have cached stats, send them before requesting new ones
        const tabUrl = request.args.url;
        let deferSending = false;
        if (this._reportStats[tabUrl]) {
          console.log("[sw] Sending cached stats to tab", tabUrl, this._reportStats[tabUrl]);
          sendResponse(this._reportStats[tabUrl]);
          deferSending = true;
        }
        
        // Call Report API
        fetch(this._API_URL + '/reports/by-url', {
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

            // Update badge text
            this.updateBadgeText(data);
            
            // Save result to cache
            this._reportStats[tabUrl] = data;
            if (!deferSending) {
              sendResponse(data);
            } else {
              console.log('[sw] Revalidating cache for tab', tabUrl, this._reportStats[tabUrl])
            }
          })
          .catch((error) => {
            console.error('Error:', error);
            sendResponse({ "success": false });
          }
        );
      }

      return true;
    });
  }
  
  toggleBadge(state) {
    if (state) {
      chrome.action.setBadgeBackgroundColor({
        color: "#00AA00",
      });
    } else {
      chrome.action.setBadgeText({
        text: "OFF",
      });
      chrome.action.setBadgeBackgroundColor({
        color: "#AAAAAA",
      });
    }
  }

  updateBadgeText(stats) {
    const count = stats["specific_reports"]["count"];
    if (count > 0) {
      chrome.action.setBadgeText({
        text: count.toString(),
      });
    } else {
      chrome.action.setBadgeText({
        text: "0",
      });
    }
  }
}

const ariadneBackground = new AriadneBackground();

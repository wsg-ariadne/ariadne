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

    // Tab URL change listener
    chrome.tabs.onUpdated.addListener((tabId, changeInfo, _) => {
      if (changeInfo.url) {
        // Request fresh stats
        console.log('[sw] Tab ' + tabId + ' URL changed to', changeInfo.url);
        this.getStats(changeInfo.url);
      }
    });

    // Message listeners
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
        fetch(this._API_URL + '/classify/text', {
          method: 'POST',
          body: JSON.stringify({
            text: cookieBannerText
          }),
          headers: {
            'Content-Type': 'application/json'
          }
        }).then((response) => response.json())
          .then((data) => {
          console.log('[sw] Detection result from API:', data);
          sendResponse(data);
        });
      } else if (request.action === "visualDetection") {
        // Listen to visual detection requests from content scripts
        const imageData = request.args.screenshot;
        console.log('[sw] Visual detection request received from tab', sender.tab.id);
        
        // POST to API
        fetch(this._API_URL + '/classify/image', {
          method: 'POST',
          body: JSON.stringify({
            text: imageData
          }),
          headers: {
            'Content-Type': 'application/json'
          }
        }).then((response) => response.json())
          .then((data) => {
          console.log('[sw] Detection result from API:', data);
          sendResponse(data);
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

        this.getStats(tabUrl, (stats) => {
          if (!deferSending) {
            console.log('[sw] Sending stats to tab', tabUrl, this._reportStats[tabUrl])
            sendResponse(stats);
          } else {
            console.log('[sw] Revalidated cache for tab', tabUrl, this._reportStats[tabUrl])
          }
        }, (error) => {
          sendResponse({
            success: false,
            error
          });
        });
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
      chrome.action.setBadgeBackgroundColor({
        color: "#AAAAAA",
      });
    }
  }

  updateBadgeText(stats) {
    console.log('[sw] Updating badge text with stats:', stats);
    if (stats !== undefined && stats.hasOwnProperty("success") &&
      stats.hasOwnProperty("specific_reports") && stats["success"]) {
      const count = stats.specific_reports.count;
      console.log('[sw] Badge count:', count)
      if (count > 0) {
        chrome.action.setBadgeText({
          text: count.toString(),
        });
        return;
      }
    }
    chrome.action.setBadgeText({
      text: "0",
    });
  }

  getStats(tabUrl, successCallback, errorCallback) {
    fetch(this._API_URL + '/reports/by-url', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        'page_url': tabUrl
      })
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('[sw] Report stats from API:', data);
        this._reportStats[tabUrl] = data;

        // Update badge text
        this.updateBadgeText(data);

        if (successCallback !== undefined) successCallback(data);
      })
      .catch((error) => {
        console.error('[sw] Error fetching report stats:', error);
        if (errorCallback !== undefined) errorCallback(error);
      }
    );
  }
}

const ariadneBackground = new AriadneBackground();

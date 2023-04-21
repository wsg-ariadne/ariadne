import * as browser from 'webextension-polyfill';

class AriadneBackground {
  constructor() {
    this._tabStates = [];
    this._reportStats = {};
    this._API_URL = 'https://ariadne.dantis.me/api/v1';
    
    // Determine if running in unpacked mode
    const that = this;
    browser.management.get(browser.runtime.id)
      .then((extensionInfo) => {
        if (extensionInfo.installType === 'development') {
          console.log('[bg] Running in development mode');
          that._API_URL = 'http://localhost:5000/api/v1';
        }
        that.addListeners();
      });
  }

  addListeners() {
    // Update badge on tab change
    browser.tabs.onActivated.addListener((activeInfo) => {
      // Get URL of active tab
      browser.tabs.get(activeInfo.tabId)
        .then((tab) => {
          console.log('[bg] Tab changed to', tab.url);
          this.toggleBadge(this._tabStates[activeInfo.tabId]);
          this.updateBadgeText(this._reportStats[tab.url]);
        });
    });

    // Tab URL change listener
    browser.tabs.onUpdated.addListener((tabId, changeInfo, _) => {
      if (changeInfo.url) {
        // Request fresh stats
        console.log('[bg] Tab ' + tabId + ' URL changed to', changeInfo.url);
        this.getStats(changeInfo.url);
      }
    });

    // Message listeners
    browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
      console.log("[bg] Received message with action", request.action);
      if (request.action === "updateBadge") {
        // Listen to updateBadge requests
        this.toggleBadge(request.args.enabled);

        // Update the tab state
        this._tabStates[sender.tab.id] = request.args.enabled;
      } else if (request.action === "detection") {
        // Listen to detection requests from content scripts
        const cookieBannerText = request.args.body;
        console.log('[bg] Detection request received from tab', sender.tab.id, 'with body:', cookieBannerText);
        
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
          console.log('[bg] Detection result from API:', data);
          sendResponse(data);
        });
      } else if (request.action === "visualDetection") {
        // Listen to visual detection requests from content scripts
        const imageData = request.args.screenshot;
        console.log('[bg] Visual detection request received from tab', sender.tab.id);
        
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
          console.log('[bg] Detection result from API:', data);
          sendResponse(data);
        });
      } else if (request.action === "requestStats") {
        console.log("[bg] Received stats request from popup", request, sender);

        // If we have cached stats, send them before requesting new ones
        const tabUrl = request.args.url;
        let deferSending = false;
        if (this._reportStats[tabUrl]) {
          console.log("[bg] Sending cached stats to tab", tabUrl, this._reportStats[tabUrl]);
          sendResponse(this._reportStats[tabUrl]);
          deferSending = true;
        }

        this.getStats(tabUrl, (stats) => {
          if (!deferSending) {
            console.log('[bg] Sending stats to tab', tabUrl, this._reportStats[tabUrl])
            sendResponse(stats);
          } else {
            console.log('[bg] Revalidated cache for tab', tabUrl, this._reportStats[tabUrl])
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
      browser.action.setBadgeBackgroundColor({
        color: "#00AA00",
      });
    } else {
      browser.action.setBadgeBackgroundColor({
        color: "#AAAAAA",
      });
    }
  }

  updateBadgeText(stats) {
    console.log('[bg] Updating badge text with stats:', stats);
    if (stats !== undefined && stats.hasOwnProperty("success") &&
      stats.hasOwnProperty("specific_reports") && stats["success"]) {
      const count = stats.specific_reports.count;
      console.log('[bg] Badge count:', count)
      if (count > 0) {
        browser.action.setBadgeText({
          text: count.toString(),
        });
        return;
      }
    }
    browser.action.setBadgeText({
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
        console.log('[bg] Report stats from API:', data);
        this._reportStats[tabUrl] = data;

        // Update badge text
        this.updateBadgeText(data);

        if (successCallback !== undefined) successCallback(data);
      })
      .catch((error) => {
        console.error('[bg] Error fetching report stats:', error);
        if (errorCallback !== undefined) errorCallback(error);
      }
    );
  }
}

const ariadneBackground = new AriadneBackground();

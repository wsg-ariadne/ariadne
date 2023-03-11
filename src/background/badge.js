function toggleBadge(state) {
  if (state) {
    chrome.action.setBadgeText({
      text: "ON",
    });
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

// Set badge to "OFF" with grey background on install
// chrome.runtime.onInstalled.addListener(() => toggleBadge(false));

// Keep a dictionary of tabId -> enabled state
const tabStates = {};

// Listen to updateBadge requests
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log("[badge] Received message", request, sender);
  if (request.action === "updateBadge") {
    toggleBadge(request.args.enabled);

    // Update the tab state
    tabStates[sender.tab.id] = request.args.enabled;
  }
});

// Update badge on tab change
chrome.tabs.onActivated.addListener((activeInfo) => {
  toggleBadge(tabStates[activeInfo.tabId]);
});

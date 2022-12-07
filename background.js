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
chrome.runtime.onInstalled.addListener(() => toggleBadge(false));

// Listen to messages from content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "enable_detection") {
    toggleBadge(true);
  } else if (request.action === "disable_detection") {
    toggleBadge(false);
  }
});

// Send a message to the active tab's content script
chrome.tabs.onActivated.addListener((activeInfo) => {
  chrome.tabs.sendMessage(activeInfo.tabId, {action: "on_focus"});
});

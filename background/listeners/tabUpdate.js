import { getStats } from "../api/stats";
import { setTransaction } from "../browser/storage";

export default (tabId, changeInfo, _) => {
  if (changeInfo.url) {
    console.log('listeners/tabUpdate: Tab ' + tabId + ' changed to', changeInfo.url);

    // Save URL to IndexedDB
    setTransaction('tabUrls', { tabId, url: changeInfo.url });

    // Request fresh stats if not a chrome:// URL
    if (changeInfo.url.startsWith('chrome://')) {
      return;
    }
    getStats(changeInfo.url, () => {}, () => {}, false);
  }
}

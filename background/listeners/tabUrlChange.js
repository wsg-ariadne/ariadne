import { getStats } from "../api/stats";

export default (tabId, changeInfo, _) => {
  if (changeInfo.url) {
    // Request fresh stats
    console.log('listeners/tabUrlChange: Tab ' + tabId + ' changed to', changeInfo.url);
    getStats(changeInfo.url);
  }
}

import * as browser from 'webextension-polyfill';
import { toggleBadge, updateBadgeText } from "../browser/badge";
import { getStats } from "../api/stats";
import { getTransaction } from '../browser/storage';

export default (activeInfo) => {
  // Get URL of active tab
  browser.tabs.get(activeInfo.tabId)
    .then((tab) => {
      console.log('listeners/tabChange: Tab changed to', tab.url);

      // Fetch latest stats
      return new Promise((res, rej) => {
        getStats(tab.url, () => res(tab.url), rej);
      })
    })
    .then(async (url) => {
      console.log('listeners/tabChange: Stats refreshed');
      const { enabled } = await getTransaction('badgeStates', activeInfo.tabId);
      const { stats } = await getTransaction('stats', url);
      toggleBadge(enabled);
      updateBadgeText(stats);
    });
}

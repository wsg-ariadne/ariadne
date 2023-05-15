import * as browser from 'webextension-polyfill';
import { toggleBadge, updateBadgeText } from "../browser/badge";
import { getStats } from "../api/stats";
import { getTransaction } from '../browser/storage';

export default (activeInfo) => {
  // Get URL of active tab
  browser.tabs.get(activeInfo.tabId)
    .then((tab) => {
      console.log('listeners/tabChange: Tab changed to', activeInfo.tabId);

      // Fetch latest stats if URL does not start with chrome:// or about:
      if (tab.url.startsWith('chrome://') || tab.url.startsWith('about:')) {
        return Promise.reject('listeners/tabChange: Ignoring internal URL');
      }
      return new Promise((res, rej) => getStats(tab.url, () => res(tab.url), rej, false));
    })
      .then(async (url) => {
        console.log('listeners/tabChange: Stats refreshed');
        let enabled = false;
        try {
          enabled = (await getTransaction('badgeStates', activeInfo.tabId)).enabled;
        } catch (_) {
          // do nothing
        }
        const { stats } = await getTransaction('stats', url);
        toggleBadge(enabled);
        updateBadgeText(stats);
      })
      .catch((err) => {
        console.log(err);
        updateBadgeText();  // Set badge text to empty
      });
}

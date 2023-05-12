import * as browser from 'webextension-polyfill';

export const getAction = () => {
  if (chrome.runtime.getManifest().manifest_version === 3) {
    return browser.action;
  }
  return browser.browserAction;
}

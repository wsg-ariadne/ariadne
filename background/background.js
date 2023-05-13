import * as browser from 'webextension-polyfill';
import {
  messageListener,
  tabChangeListener,
  tabCloseListener,
  tabUpdateListener
} from './listeners';

browser.runtime.onInstalled.addListener((details) => {
  console.log('Extension installed', details);
});
  
// Delete IndexedDB database on load
const deleteDatabase = indexedDB.deleteDatabase('ariadne');
deleteDatabase.onsuccess = () => {
  console.log('Database deleted');

  // Register listeners
  browser.runtime.onMessage.addListener(messageListener);
  browser.tabs.onActivated.addListener(tabChangeListener);
  browser.tabs.onRemoved.addListener(tabCloseListener);
  browser.tabs.onUpdated.addListener(tabUpdateListener);
}

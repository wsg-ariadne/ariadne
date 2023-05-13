import * as browser from 'webextension-polyfill';
import {
  messageListener,
  tabChangeListener,
  tabUrlChangeListener
} from './listeners';

browser.runtime.onInstalled.addListener((details) => {
  console.log('Extension installed', details);
  
  // Delete IndexedDB database on register
  const deleteDatabase = indexedDB.deleteDatabase('ariadne');
  deleteDatabase.onsuccess = () => {
    console.log('Database deleted');

    // Register listeners
    browser.runtime.onMessage.addListener(messageListener);
    browser.tabs.onActivated.addListener(tabChangeListener);
    browser.tabs.onUpdated.addListener(tabUrlChangeListener);
  }
});

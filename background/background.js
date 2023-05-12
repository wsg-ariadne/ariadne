import * as browser from 'webextension-polyfill';
import {
  messageListener,
  tabChangeListener,
  tabUrlChangeListener
} from './listeners';

browser.runtime.onMessage.addListener(messageListener);
browser.tabs.onActivated.addListener(tabChangeListener);
browser.tabs.onUpdated.addListener(tabUrlChangeListener);

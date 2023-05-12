import { toggleBadge } from "../browser/badge";
import { getTransaction, setTransaction } from "../browser/storage";
import { getStats } from "../api/stats";
import { classifyImage, classifyText } from "../api/classifier";
import * as browser from "webextension-polyfill";

export default (request, sender, sendResponse) => {
  if (request.action === "updateBadge") {
    // Save and apply the badge state
    setTransaction('badgeStates', {
      tabId: sender.tab.id,
      enabled: request.args.enabled
    }).then(() => toggleBadge(request.args.enabled));
  } else if (request.action === "detection") {
    // Listen to detection requests from content scripts
    const cookieBannerText = request.args.body;
    console.log('listeners/message: Calliope request received from tab', sender.tab.id, 'with body:', cookieBannerText);
    
    // POST to API
    classifyText(cookieBannerText, (data) => {
      console.log('listeners/message: Calliope result from API:', data);

      // Save result
      browser.tabs.get(sender.tab.id)
        .then((tab) => tab.url)
        .then((url) => setTransaction('calliope', {
          url,
          cookieBannerText,
          tripped: !data.is_good
        }))
        .then(() => sendResponse(data));
    });
  } else if (request.action === "visualDetection") {
    // Listen to visual detection requests from content scripts
    const imageData = request.args.screenshot;
    console.log('listeners/message: Janus request received from tab', sender.tab.id);
    
    // POST to API
    classifyImage(imageData, (data) => {
      console.log('listeners/message: Janus result from API:', data);

      // Save result
      browser.tabs.get(sender.tab.id)
        .then((tab) => tab.url)
        .then((url) => setTransaction('janus', {
          url,
          imageData,
          result: data.classification
        }))
        .then(() => sendResponse(data));
    });
  } else if (request.action === "requestStats") {
    console.log("listeners/message: Received stats request from popup", request, sender);

    (async () => {
      const tabUrl = request.args.url;
      let calliopeResult = false;
      let janusResult = false;
      let cookieBannerText = '';
      let imageData = '';

      // Try fetching results from DB
      try {
        const cachedCalliope = await getTransaction('calliope', tabUrl);
        calliopeResult = cachedCalliope.tripped;
        cookieBannerText = cachedCalliope.cookieBannerText;
      } catch (_) {
        // do nothing
      }
      try {
        const cachedJanus = await getTransaction('janus', tabUrl);
        janusResult = cachedJanus.result;
        imageData = cachedJanus.imageData;
      } catch (_) {
        // do nothing
      }

      // If we have cached stats, send them before requesting new ones
      let deferSending = false;
      let stats = { calliopeResult, janusResult, cookieBannerText, imageData };
      try {
        stats = { ...stats, ...await getTransaction('stats', tabUrl) };
        console.log('listeners/message: Sending stats to tab', tabUrl, stats)
        sendResponse(stats);
        deferSending = true;
      } catch (e) {
        console.error(e);
      } finally {
        getStats(tabUrl, (newStats) => {
          stats = { ...stats, ...newStats };
          if (!deferSending) {
            console.log('listeners/message: Sending stats to tab', tabUrl, stats)
            sendResponse(stats);
          } else {
            console.log('listeners/message: Revalidated cache for tab', tabUrl)
          }
        }, (error) => {
          sendResponse({
            success: false,
            error
          });
        })
      }
    })();
  }

  return true;
}

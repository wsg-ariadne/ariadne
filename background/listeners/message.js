import { toggleBadge } from "../browser/badge";
import { getTransaction, setTransaction } from "../browser/storage";
import { getStats } from "../api/stats";
import { classifyImage, classifyText } from "../api/classifier";

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
      sendResponse(data);
    });
  } else if (request.action === "visualDetection") {
    // Listen to visual detection requests from content scripts
    const imageData = request.args.screenshot;
    console.log('listeners/message: Janus request received from tab', sender.tab.id);
    
    // POST to API
    classifyImage(imageData, (data) => {
      console.log('listeners/message: Janus result from API:', data);
      sendResponse(data);
    });
  } else if (request.action === "requestStats") {
    console.log("listeners/message: Received stats request from popup", request, sender);

    // If we have cached stats, send them before requesting new ones
    const tabUrl = request.args.url;
    let deferSending = false;
    getTransaction('stats', tabUrl)
      .then((stats) => {
        console.log("listeners/message: Sending cached stats to tab", tabUrl, stats);
        sendResponse(stats);
        deferSending = true;
      })
      .catch((e) => {
        console.error(e);
      })
      .finally(() => getStats(tabUrl, (newStats) => {
          if (!deferSending) {
            console.log('listeners/message: Sending stats to tab', tabUrl, this._reportStats[tabUrl])
            sendResponse(newStats);
          } else {
            console.log('listeners/message: Revalidated cache for tab', tabUrl, this._reportStats[tabUrl])
          }
        }, (error) => {
          sendResponse({
            success: false,
            error
          });
        })
      )
  }

  return true;
}

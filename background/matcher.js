// Listen to detection requests from content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "detection") {
    const documentBody = request.args.body;

    // Create a copy of the body without script tags
    const bodyCopy = documentBody.cloneNode(true);
    const scriptTags = bodyCopy.getElementsByTagName("script");
    for (let i = 0; i < scriptTags.length; i++) {
      scriptTags[i].remove();
    }

    // Iterate through all of the leaves in the DOM tree
    // and look for occurrences of "cookies" or "trackers"
    const leaves = [];
    const walker = document.createTreeWalker(bodyCopy, NodeFilter.SHOW_TEXT);
  }
});

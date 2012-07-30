chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
    if (request.method == "getSettings") {
      sendResponse({
        urls_to_jirafy: localStorage['urls_to_jirafy'],
        project_keys: localStorage['project_keys'],
        jira_server: localStorage['jira_server']
      });
    } else {
      sendResponse({}); // snub them.
    }
});

function install_notice() {
  if (localStorage.getItem('install_time'))
    return;

  var now = new Date().getTime();
  localStorage.setItem('install_time', now);
  chrome.tabs.create({url: "jirafy-config.html"});
}
install_notice();

// Called when the url of a tab changes.
function checkForValidUrl(tabId, changeInfo, tab) {
  if (matchesAnyUrlPatterns(tab.url, localStorage['urls_to_jirafy'])) {
    chrome.pageAction.show(tabId);
  }
};

function matchesAnyUrlPatterns(url, urls_to_jirafy) {
  urls = urls_to_jirafy.split(",");
  for(var c = 0; c < urls.length; c++) {
    if (url.indexOf(urls[c]) != -1) return true;
  }
  return false;
}

// Listen for any changes to the URL of any tab.
chrome.tabs.onUpdated.addListener(checkForValidUrl);

// When the page action is clicked, go to the config page.
chrome.pageAction.onClicked.addListener(function(tab) {
  chrome.tabs.update(tab.id, {"url": "jirafy-config.html"});
});
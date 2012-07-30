chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
    if (request.method == "getSettings") {
      sendResponse({
        urls_to_jirafy: localStorage['urls_to_jirafy'],
        project_keys: localStorage['project_keys'],
        jira_server: localStorage['jira_server']
      });
    }
    else {
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
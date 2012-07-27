chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
    if (request.method == "getSettings") {
      sendResponse({
        hostnames_to_jirafy: localStorage['hostnames_to_jirafy'],
        project_keys: localStorage['project_keys'],
        jira_server: localStorage['jira_server']
      });
    }
    else {
      sendResponse({}); // snub them.
    }
});
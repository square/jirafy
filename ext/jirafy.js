function replaceTicketNumbersWithLinks(projectKeys, jiraServer) {
  console.log("Replacing ticket numbers");
  regexes = []
  for(var c = 0; c < projectKeys.length; c++) {
    regexes[c] = new RegExp("(browse/)?(" + projectKeys[c] + "-[0-9]+)", "g");
  }

  var ticketNodes = getTicketNodes($("body")[0], regexes);
  for (var i = 0; i < ticketNodes.length; i++) {
    node = ticketNodes[i];
    newVal = node.nodeValue;
    for(var c = 0; c < regexes.length; c++) {
      newVal = newVal.replace(regexes[c],
                               function(matched, hasBrowsePrefix, ticket) {
                                 // Only linkify ticket numbers if they are _not_ prefixed with "browse/".  We could
                                 // use a negative lookbehind regex, but javascript doesn't support them
                                 replaceVal = hasBrowsePrefix ?
                                   matched : // This one has a browse prefix: don't replace anything.
                                   "<a href=\"" + jiraServer + "browse/" + ticket + "\">" + ticket + "</a>";
                                 return replaceVal;
                               }
                             );
    }
    // We can't just do node.innerHTML = newVal because text nodes don't have an innerHTML property,
    // so instead we replace the textnode with a new span containing the new html.
    wrapper = document.createElement("span");
    wrapper.innerHTML = newVal;
    parent = node.parentNode;
    parent.insertBefore(wrapper, node);
    parent.removeChild(node);
  }
}

function getTicketNodes(node, regexes) {
  var textNodes = [];

  function getMatchingNodes(node) {
    var parentTag = node.parentElement.tagName;

    if (node.nodeType == 3
        && parentTag != 'A' && parentTag != 'TEXTAREA'
        && matches(node, regexes)) {
      textNodes.push(node);
    } else {
      for (var i = 0, len = node.childNodes.length; i < len; ++i) {
        getMatchingNodes(node.childNodes[i]);
      }
    }
  }

  getMatchingNodes(node);
  return textNodes;
}

function matches(node, regexes) {
  for(var c = 0; c < regexes.length; c++) {
    if (regexes[c].exec(node.nodeValue)) {
      return true;
    }
  }
}

chrome.extension.sendRequest({method: "getJirafySettings"}, function(response) {
  if (response.project_keys && response.jira_server) {
    keys = response.project_keys.split(",");
    replaceTicketNumbersWithLinks(keys, response.jira_server);
  }
});


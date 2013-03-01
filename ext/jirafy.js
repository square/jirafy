function replaceTicketNumbersWithLinks(projectKeys, jiraServer) {
  var regexes = getRegexes(projectKeys);
  var nodes = getTicketNodes(document.getElementsByTagName('body')[0], regexes);
  replaceNodes(regexes, nodes, jiraServer);
}

function replaceNodes(regexes, nodes, jiraServer) {
  if (jiraServer.substr(jiraServer.length - 1) !== '/') {
    jiraServer += '/';
  }
  for (var i = 0, nodeCount = nodes.length; i < nodeCount; i++) {
    var node = nodes[i];
    var newVal = node.nodeValue;
    for(var c = 0, regexCount = regexes.length; c < regexCount; c++) {
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
    if (newVal !== node.nodeValue) {
      // We can't just do node.innerHTML = newVal because text nodes don't have an innerHTML property,
      // so instead we replace the textnode with a new span containing the new html.
      var wrapper = document.createElement("span");
      wrapper.innerHTML = newVal;
      var parent = node.parentNode;
      parent.insertBefore(wrapper, node);
      parent.removeChild(node);
    }
  }
}

function getRegexes(projectKeys) {
  var regexes = []
  for(var c = 0, len = projectKeys.length; c < len; c++) {
    regexes[c] = new RegExp("(browse/)?(" + projectKeys[c] + "-\\d+)");
  }
  return regexes;
}

function getTicketNodes(node, regexes) {
  var textNodes = [];

  var matches = function(node, regexes) {
    var value = node.nodeValue;
    for (var c = 0, len = regexes.length; c < len; c++) {
      if (value.match(regexes[c])) {
        return true;
      }
    }
  };

  var queue = [node];
  while (queue.length > 0) {
    var childNode = queue.shift();
    var parentTag = childNode.parentElement.tagName;

    if (childNode.nodeType === 3
        && parentTag !== 'A' && parentTag !== 'TEXTAREA'
        && matches(childNode, regexes)) {
      textNodes.push(childNode);
    } else {
      for (var i = 0, len = childNode.childNodes.length; i < len; i++) {
        queue.push(childNode.childNodes[i]);
      }
    }
  }

  return textNodes;
}

chrome.extension.sendRequest({method: "getJirafySettings"}, function(response) {
  if (response.project_keys && response.jira_server) {
    keys = response.project_keys.split(",");
    replaceTicketNumbersWithLinks(keys, response.jira_server);
  }
});

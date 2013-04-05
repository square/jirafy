function replaceTicketNumbersWithLinks(projectKeys, jiraServer) {
  var regex = getRegex(projectKeys);
  var nodes = getTicketNodes(document.getElementsByTagName('body')[0], regex);
  replaceNodes(regex, nodes, jiraServer);
}

function replaceNodes(regex, nodes, jiraServer) {
  if (jiraServer.substr(jiraServer.length - 1) !== '/') {
    jiraServer += '/';
  }
  for (var i = 0, nodeCount = nodes.length; i < nodeCount; i++) {
    var node = nodes[i];
    var newVal = node.nodeValue;
    newVal = newVal.replace(regex,
                             function(matched, hasBrowsePrefix, ticket) {
                               // Only linkify ticket numbers if they are _not_ prefixed with "browse/".  We could
                               // use a negative lookbehind regex, but javascript doesn't support them
                               replaceVal = hasBrowsePrefix ?
                                 matched : // This one has a browse prefix: don't replace anything.
                                 "<a href=\"" + jiraServer + "browse/" + ticket + "\" target='_blank'>" + ticket + "</a>";
                               return replaceVal;
                             }
                           );
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

function getRegex(projectKeys) {
  return new RegExp("(browse/)?((" + projectKeys.join('|') + ")-\\d+)","g");
}

function getTicketNodes(node, regex) {
  var textNodes = [];

  var queue = [node];
  while (queue.length > 0) {
    var childNode = queue.shift();
    var parentTag = childNode.parentElement.tagName;

    if (childNode.nodeType === 3
        && parentTag !== 'A' && parentTag !== 'TEXTAREA'
        && childNode.nodeValue.match(regex)) {
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

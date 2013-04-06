var replaceTicketNumbersWithLinks = function(projectKeys, jiraServer, newWindow, ignoreElements, startNode) {
  var regex = getRegex(projectKeys),
    ignore = ['a', 'textarea', 'pre', 'code'].concat(ignoreElements);

  startNode = (startNode) ? startNode : document.getElementsByTagName('body')[0];
  if (jiraServer.substr(jiraServer.length - 1) !== '/') {
    jiraServer += '/';
  }

  getMatches(startNode, regex, function(node, ticket, offset)  {
    var jiraLink = document.createElement("a");

    jiraLink.href = jiraServer + "browse/" + ticket;
    jiraLink.textContent = ticket;

    if(newWindow == "true") {
      jiraLink.target = "_blank";
    }

    node.parentNode.insertBefore(jiraLink, node.nextSibling);
  }, ignore);
};

var getRegex = function (projectKeys) {
  return new RegExp("(browse/)?((" + projectKeys.join('|') + ")-\\d+)","g");
};

var getMatches = function(parent, regex, callback, ignore) {
  var node = parent.firstChild;

  if(node === null) return parent;

  do {
    switch (node.nodeType) {
      case 1:
         if (ignore.indexOf(node.tagName.toLowerCase()) > -1) {
             continue;
         }

         getMatches(node, regex, callback, ignore);
         break;

      case 3:
        node.data.replace(regex, function(all) {
          // If this one has a browse prefix: don't replace anything.
          if(arguments[1]) return;

          var args = [].slice.call(arguments),
            //if two are found in the same node we need to use the new offset for all except the first
            offset = (node.data.indexOf(all) >= 0) ? node.data.indexOf(all) : args[args.length - 2],
            newNode = node.splitText(offset);

          newNode.data = newNode.data.substr(all.length);

          callback.apply(window, [node].concat(args));

          node = newNode;

         });
         break;
      }
  } while (node = node.nextSibling);

  return parent;
};

chrome.extension.sendRequest({method: "getJirafySettings"}, function(response) {
  if (response.project_keys && response.jira_server) {
    keys = response.project_keys.split(",");
    ignore_elements = (response.ignore_elements) ? response.ignore_elements.split(",") : [];
    replaceTicketNumbersWithLinks(keys, response.jira_server, response.new_window, ignore_elements);
  }
});
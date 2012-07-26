function replaceTicketNumbersWithLinks(projectKey, jiraServer) {
  // The jquery "contains" operator doesn't support regex.  This one does.
  // See http://stackoverflow.com/questions/8914296/javascript-regular-expressions-with-jquery-contains-regex-extension
  $.extend($.expr[':'],{
    containsRegex: function(a,i,m){
      var regreg =  /^\/((?:\\\/|[^\/])+)\/([mig]{0,3})$/,
      reg = regreg.exec(m[3]);
      return reg ? RegExp(reg[1], reg[2]).test($.trim(a.innerHTML)) : false;
    }
  });
  // So now let's actually search the page for ticket numbers.
  $("*:containsRegex(/" + projectKey + "-[0-9]+/)").each(function (index, value) {
    var pattern = new RegExp("(" + projectKey + "-[0-9]+)", "g");
    if (value.tagName != "TITLE" // Is not the document's "title" node.
        && value.tagName != "A" // Is not already a link node.
        && value.tagName != "TEXTAREA" // Is not text inside a textbox.
        && value.firstChild // Has a child node.
        && value.childNodes.length == 1 // Only the one child node.
        && value.firstChild.nodeType == 3 // And it's a text node.
        && pattern.exec(value.firstChild.nodeValue)) { // And the text has the project key in it.

        browsePattern = new RegExp("(browse/)?(" + projectKey + "-[0-9]+)", "g");
        // Now let's replace the body of the parent with the text (+ links).
        value.innerHTML = value.firstChild.nodeValue.replace(browsePattern,
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
  });
}

chrome.extension.sendRequest({method: "getSettings"}, function(response) {
  hostname = new String(window.location.hostname);
  if (hostname.indexOf(response.hostnames_to_jirafy) != -1) {
    // TODO handle multiple hostnames, keys, servers
    replaceTicketNumbersWithLinks(response.project_keys, response.jira_server);
  }
});

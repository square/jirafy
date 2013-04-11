var selectedProjects = [];

function jiraServerChanged() {
  $("#loadProjectKeys").show();
  save_options();
}

// Saves options to localStorage.
function save_options() {
  localStorage["urls_to_jirafy"] = $("#urls_to_jirafy").val();
  localStorage["ignore_elements"] = $("#ignore_elements").val();
  localStorage["project_keys"] = $("#project_keys").val();
  localStorage["jira_server"] = getJiraServerValue();
  localStorage["new_window"] = $("#new_window").is(":checked");
}

// Restores select box state to saved value from localStorage.
function restore_options() {
  urlsToJirafy = $("#urls_to_jirafy");
  ignoreElements = $("#ignore_elements");
  projectKeys = $("#project_keys");
  jiraServer = $("#jira_server");
  newWindow = $("#new_window");
  setRealOnChange(urlsToJirafy, save_options);
  setRealOnChange(ignoreElements, save_options);
  setRealOnChange(projectKeys, projectKeysChanged);
  setRealOnChange(jiraServer, jiraServerChanged);
  setRealOnChange(newWindow, save_options);

  var hostnamesToJirafy = localStorage["urls_to_jirafy"];
  if (!hostnamesToJirafy) {
    return;
  }
  urlsToJirafy.val(localStorage["urls_to_jirafy"]);

  localStorage["ignore_elements"] = localStorage.getItem("ignore_elements")!==null
    ? localStorage["ignore_elements"]
    : "pre,code";
  ignoreElements.val(localStorage["ignore_elements"]);

  projectKeys.val(localStorage["project_keys"]);

  keys = localStorage["project_keys"].split(",");
  for (index = 0; index < keys.length; index++) {
    selectedProjects[keys[index]] = true;
  }
  jiraServer.val(localStorage["jira_server"]);

  if(localStorage["new_window"] == 'true')  {
    newWindow.attr('checked', 'checked');
  }
}

function setRealOnChange(field, onChangeMethod) {
  (function () {
    var oldVal;
    field.bind('change keypress paste focus textInput input', function () {
      var val = (field.is(":checkbox")) ? field.is(":checked") : this.value;
      if (val !== oldVal) {
        oldVal = val;
        onChangeMethod();
      }
    });
  }());
}

// Load the JIRA project keys from the specified server.
function loadJiraProjectKeys() {
  $("#loadProjectKeys").hide();
  $.getJSON(getJiraServerValue() + "rest/api/2/project", function(data) {
    if (data.length === 0) {
      alert("No results returned from that JIRA server.  Is the URL correct?  Are you logged in?  Is the API enabled?");
      $("#loadProjectKeys").show();
    }
    var items = [];
    // Populate the checkboxes with the API response.
    for(var c = 0; c < data.length; c++) {
      project = data[c].key;
      isChecked = selectedProjects[project] ? ' checked' : '';
      items.push('<input type="checkbox" id="jiraproj-' + project + '" value="' + project + '" class="project-checkbox" ' + isChecked + '><label for="jiraproj-' + project + '">' + project + '</label><br>');
    }
    $("#project_checkboxes_container").replaceWith($("<div/>", {
      'id': 'project_checkboxes_container',
      'class': 'project-keys-list',
      html: items.join('')
    }));
    $("#project_checkboxes_container :input").click(function() {
      checkProject(this, this.value);
      // For some reason this doesn't fire our setRealOnChange event: manually fire it.
      projectKeysChanged();
    });
  });
}

// Do a reverse lookup on the checkboxes populated from JIRA and update checkbox state based
// on what I'm typing in the field.
function projectKeysChanged() {
  selectedProjects = [];
  keys = $("#project_keys").val().split(",");
  for (index = 0; index < keys.length; index++) {
    if (keys[index]) { // Don't add empty keys if they type in "ANDROID,,"
      selectedProjects[keys[index]] = true;
    }
  }
  $("#project_checkboxes_container").children().each(function() {
    var kid = $(this);
    kid.attr("checked", typeof selectedProjects[kid.val()] !== 'undefined');
  });
  // Now save whatever I typed in.
  save_options();
}

// Called when one of the checkboxes is checked.
function checkProject(input, value) {
  if (input.checked) {
    selectedProjects[value] = true;
  } else {
    selectedProjects[value] = false;
  }
  var projectStr = "";
  var first = true;
  for(var project in selectedProjects) {
    if (selectedProjects[project]) {
      if (!first && projectStr.length > 0) projectStr += ",";
      projectStr += project;
    }
    first = false;
  }
  $("#project_keys").val(projectStr);
}

// Safely parse the value of the jira server field, adding a trailing slash if there isn't one.
function getJiraServerValue() {
  field = $("#jira_server").val();
  if (!field) return "";
  if (!field.match("/$")) {
    field = field + "/";
  }
  return field;
}

// Add event listeners once the DOM has fully loaded by listening for the
// `DOMContentLoaded` event on the document, and adding your listeners to
// specific elements when it triggers.
document.addEventListener('DOMContentLoaded', function () {
  restore_options();
  $("#loadProjectKeys").click(function() {
    loadJiraProjectKeys();
  });
});

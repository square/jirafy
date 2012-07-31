jirafy
======

![Jirafy Logo](https://git.squareup.com/square/jirafy/raw/master/ext/icon_128.png)

Chrome extension that linkifies JIRA ticket numbers on a configurable set of webpages.

installation
=====

Go to this link: https://git.squareup.com/square/jirafy/raw/master/jirafy.crx

installation for jirafy developers
=====

Follow these steps if you are tweaking the jirafy code and want to quickly see your changes reflected in the browser:
* Clone this repo
* Go to Chrome's Extensions area and make sure "Developer Mode" is checked
* Click the "Load unpacked extension..." button and then choose this repo's folder
* Click the "Options" link to configure the plugin

#### a note on permissions

Because jirafy is very configurable, it has to request a broad set of permissions.  Although it requests these broad 
permissions, no work is done on pages unless they match your configured url pattern.  Likewise, although it requests
permission to access any external websites, this is only used so that jirafy can query your JIRA server's API and load
all the possible project keys.
Jirafy
======

![Logo](ext/icon_128.png)

Chrome extension that linkifies JIRA ticket numbers on a configurable set of
webpages.

Available from [the Chrome Store][1].

Because *Jirafy* is very configurable, it has to request a broad set of
permissions.  Although it requests these broad permissions, no work is done on
pages unless they match your configured url pattern.  Likewise, although it
equests permission to access any external websites, this is only used so that
jirafy can query your JIRA server's API and load all the possible project keys.


Developing
----------

Follow these steps if you are tweaking the jirafy code and want to quickly see
your changes reflected in the browser:

 * Clone this repository.
 * Go to Chrome's Extensions area and make sure "Developer Mode" is checked.
 * Click the "Load unpacked extension..." button and then choose this repo's folder.
 * Click the "Options" link to configure the plugin.

Tests for the plugin can be run by opening `test.html` in your browser.


License
-------

    Copyright 2013 Square, Inc.

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.


 [1]: ????TODO????
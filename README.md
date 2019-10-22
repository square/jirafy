Jirafy
======

![Logo](ext/icon_128.png)

Chrome extension that linkifies JIRA ticket numbers on a configurable set of
webpages.  

If you only need this to work on GitHub, just use [Github's Autolinked Resources][2] feature.

This used to be available from the Chrome Store but it somehow got unpublished.  There's a _different_ extension in the Chrome store by the same name.  Buyer beware!  And if somebody still has the keys to publish this, I guess you can republish this one but I'm not sure anyone is still using it.

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


 [1]: https://chrome.google.com/webstore/detail/npldkpkhkmpnfhpmeoahhakbgcldplbj
 [2]: https://github.blog/2019-10-14-introducing-autolink-references/

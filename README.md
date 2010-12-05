A simple cross-platform simplenote client

The point is trying to be extremely cross-platform, its a [work in progress](http://alexkessinger.net/story/boilerplate-html5-app) lot's of rough edges. 

* Types of Platforms
    * Browsers
    * Phones
    * Native Wrappers
    * TV's 


# Browsers

Using YQL where applicable, we can create an in browser client. This should work on any modern browser, it has been tested in. 

    * Chrome
    * Safari 
    * Firefox
    
    
    
# References 

The basic HTML, and main frame works is from  a [Simplenote client for chrome](https://github.com/janne/simplenote). I then swapped in a bunch of stuff from the [phonegap-start](https://github.com/phonegap/phonegap-start) package to be compliant. I moved a bunch from the background.html into index.html.

Google Chrome extensions communicate across ports, I changed the usage of ports into the jQuery custom events.

After digging into the original extension I kept running into 401 errors from Simplenote, I also wanted this whole thing to work on the web without the need to install anything, so I swapped in a [generic simplenote lib](https://github.com/carlo/simplenote-js) that was written entirely in JS and uses YQL to do cross-domain POST's. 

I also dug through [simplenote-html](https://github.com/tominsam/simplenote-html), and [Noted](https://github.com/haeffb/Noted) for inspiration.

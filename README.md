A simple cross-platform, progressively enhanced, web app. 

The point is trying to be extremely cross-platform, its a [work in progress](http://alexkessinger.net/story/boilerplate-html5-app) lot's of rough edges. 

* Types of Platforms
    * Browsers
    * Phones
    * Native Wrappers
    * TV's 


# Browsers

Using YQL where applicable, we can create an in browser client. This should work on any modern browser, it has been tested in. You can find the web version at <http://html5.alexkessinger.net/simplenote>

    * Chrome
    * Safari 
    * Firefox
    
    
    
# References 

Before it was oblique stratgies card deck this started as a simplenote client, there is still tag that had the initial work in it, but the point is to make something cross-platform, so I switched to do an oblique strategies thing. 

The basic HTML, and main frame works is from  a [Simplenote client for chrome](https://github.com/janne/simplenote). I then swapped in a bunch of stuff from the [phonegap-start](https://github.com/phonegap/phonegap-start) package to be compliant. I moved a bunch from the background.html into index.html.

Google Chrome extensions communicate across ports, I changed the usage of ports into the jQuery custom events.

After digging into the original extension I kept running into 401 errors from Simplenote, I also wanted this whole thing to work on the web without the need to install anything, so I swapped in a [generic simplenote lib](https://github.com/carlo/simplenote-js) that was written entirely in JS and uses YQL to do cross-domain POST's. 

I also dug through [simplenote-html](https://github.com/tominsam/simplenote-html), and [Noted](https://github.com/haeffb/Noted) for inspiration.

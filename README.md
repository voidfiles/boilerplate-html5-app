A simple cross-platform, progressively enhanced, web app. 

The point is trying to be extremely cross-platform, its a [work in progress](http://alexkessinger.net/story/boilerplate-html5-app) lot's of rough edges. 

* Types of Platforms
    * Browsers
    * Phones
    * Native Wrappers
    * TV's 

# Platforms Supported

* [Opera Mini 4.1](http://my.opera.com/operamini/blog/2008/05/13/opera-mini-4-1-final)
* [Opera Mini 5](http://www.opera.com/mobile/demo/)
* [lynx](http://lynx.isc.org/)
* iPhone
* Chrome
* Firefox


# Screenshots 

## Opera Mini 4

<p>
    <img  src="http://dl.dropbox.com/u/133599/Screenshots/g4f1.png" alt=" " />
    <img  src="http://dl.dropbox.com/u/133599/Screenshots/d0q0.png" alt=" " />
        
</p>

## Opera Mini 5

<p>
    <img  src="http://dl.dropbox.com/u/133599/Screenshots/c5pb.png" alt=" " />
    <img  src="http://dl.dropbox.com/u/133599/Screenshots/78iz.png" alt=" " />
        
</p>
    
        
    
# References 

Before it was oblique strategies card deck this started as a simplenote client, there is still tag that had the initial work in it, but the point is to make something cross-platform, so I switched to do an oblique strategies thing. 

The basic HTML, and main frame works is from  a [Simplenote client for chrome](https://github.com/janne/simplenote). I then swapped in a bunch of stuff from the [phonegap-start](https://github.com/phonegap/phonegap-start) package to be compliant. I moved a bunch from the background.html into index.html.

Google Chrome extensions communicate across ports, I changed the usage of ports into the jQuery custom events.

After digging into the original extension I kept running into 401 errors from Simplenote, I also wanted this whole thing to work on the web without the need to install anything, so I swapped in a [generic simplenote lib](https://github.com/carlo/simplenote-js) that was written entirely in JS and uses YQL to do cross-domain POST's. 

I also dug through [simplenote-html](https://github.com/tominsam/simplenote-html), and [Noted](https://github.com/haeffb/Noted) for inspiration.

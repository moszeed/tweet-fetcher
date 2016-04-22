# tweet-fetcher

Get your Tweets from Twitter, in Node and Browser (with Browserify),  
without using the Twitter 1.1 API.  
Based on Jason Mayes "twitter-post-fetcher" https://github.com/jasonmayes/Twitter-Post-Fetcher

[![Join the chat at https://gitter.im/moszeed/tweet-fetcher](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/moszeed/tweet-fetcher?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)




## How to use ?

1. Create a Widget: https://twitter.com/settings/widgets
2. Copy the Widget-ID  
3. Add this to your Code:  

```
    (function() {

        "use strict";

        // require the module
        const tweetFetcher = require('tweet-fetcher');

        // configure
        const config = {
            "id"      : "720905681944080384", // the widget id
            "language": "en"                  // the widget language
        };

        // fetch the data
        tweetFetcher.fetch(config)
            .then(function(tweets) {
                console.log('do something with the ', tweets);
            })
            .catch(function(err) {
               console.log(err);
            });
    })();
```
    

# tweet-fetcher

Get your Tweets from Twitter, in Node and Browser (with Browserify),
without using the Twitter 1.1 API.
Based on, the awesome work of Jason Mayes "twitter-post-fetcher" Module https://github.com/jasonmayes/Twitter-Post-Fetcher

## Why this Module
I simply needed a module with **Promise** Support for **Nodejs** and the **Browser**.

## How to use ?

1. Create a Widget: https://twitter.com/settings/widgets
2. Copy the Widget-ID
3. Add this to your Code:

```
(function () {
    "use strict";

    // require the module
    const tweetFetcher = require('tweet-fetcher');

    // configure
    const config = {
        "id"      : "720905681944080384", // the widget id
        "language": "en" // the widget language
    };

    // fetch the data
    tweetFetcher(config)
        .then(function(tweets) {
            console.log('do something with the ', tweets);
        })
        .catch(function(err) {
           console.log(err);
        });
})();
```

##### Support
[Buy me a Coffee](https://www.patreon.com/moszeed)

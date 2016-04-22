(function() {

    "use strict";

    const _            = require('underscore');
    const test         = require('tape');
    const tweetFetcher = require('../src/tweet-fetcher.js');

    const config = {
        "id": "720905681944080384"
    }


    var tweetsStore = null;
    var tweetsStoreDE = null;

    test('check environment', function(t) {
        if (typeof window !== 'undefined') {
            t.ok(true, "browser test");
        } else {
            t.ok(true, "node test");
        }

        t.end();
    });


    test('fetch.default', function(t) {

        tweetFetcher.fetch(config)
            .then((tweets) => {
                t.ok(tweets.length === 20, '20 tweets fetched');
                tweetsStore = tweets;
                t.end();
            })
            .catch(t.end);
    });

    test('fetch.DELanguage', function(t) {

        config.language = 'de';

        tweetFetcher.fetch(config)
            .then((tweets) => {
                t.ok(tweets.length === 20, '20 tweets fetched');
                tweetsStoreDE = tweets;
                t.end();
            })
            .catch(t.end);
    });

    test('tweets.check.default', function(t) {
        _.each(tweetsStore, function(tweet, index) {
            t.comment('tweet at index:' + index)
            t.ok(tweet.content, 'content available: ' + tweet.content);
            t.ok(tweet.permaLink, 'permaLink available: ' + tweet.permaLink);
            t.ok(tweet.user, 'user available: ' + JSON.stringify(tweet.user));
            t.ok(tweet.images, 'images available: ' + JSON.stringify(tweet.images));
            t.ok(tweet.time, 'time available: ' + JSON.stringify(tweet.time));
        });
        t.end();
    });

    test('tweets.check.DE', function(t) {
        _.each(tweetsStoreDE, function(tweet, index) {
            t.comment('tweet at index:' + index)
            t.ok(tweet.content, 'content available: ' + tweet.content);
            t.ok(tweet.permaLink, 'permaLink available: ' + tweet.permaLink);
            t.ok(tweet.user, 'user available: ' + JSON.stringify(tweet.user));
            t.ok(tweet.images, 'images available: ' + JSON.stringify(tweet.images));
            t.ok(tweet.time, 'time available: ' + JSON.stringify(tweet.time));
            t.ok(tweet.time.timeAsTextShort.search('Veröffentlicht') !== -1, 'its german');
        });
        t.end();
    });


})()

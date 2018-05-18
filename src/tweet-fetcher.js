(function () {
    'use strict';

    var _ = require('underscore');
    var request = require('xhr-request');

    var tweetParser = require('./tweet-parser.js');

    var urlTemp = _.template(
        'https://cdn.syndication.twimg.com/widgets/timelines/<%= id %>' +
        '?&lang=<%= language%>&dnt=true&suppress_response_codes=true&rnd=<%= randomNumber%>'
    );

    function fetchTweetsInNode (url) {
        return new Promise(function (resolve, reject) {
            request(url, {
                json   : true,
                headers: {
                    'DNT': 1
                }
            }, function (err, data) {
                if (err) reject(err);
                else {
                    resolve(data.body);
                }
            });
        });
    }

    function fetchTweetsInBrowser (url) {
        return new Promise(function (resolve, reject) {
            try {
                var head = document.getElementsByTagName('body')[0];

                var script = document.createElement('script');
                script.type = 'text/javascript';
                script.src = url + '&callback=__twttr.callback';

                head.appendChild(script);

                window.__twttr = {
                    callback: function (data) {
                        resolve(data.body);
                    }
                };
            } catch (err) {
                reject(err);
            }
        });
    }

    function fetchTweets (params) {
        var url = urlTemp({
            id          : params.id,
            randomNumber: Math.floor(Math.random()),
            language    : params.language
        });

        var fetchPromise = (typeof window !== 'undefined') ? fetchTweetsInBrowser(url) : fetchTweetsInNode(url);
        return fetchPromise.then(tweetParser.parseTweets);
    }

    function fetch (params) {
        params = params || {};
        params.language = params.language || 'en';

        if (!params.id) throw Error('no id given');

        return fetchTweets(params);
    };

    module.exports = fetch;
})();

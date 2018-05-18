(function () {
    'use strict';

    // require the module
    const tweetFetcher = require('..');

    // configure
    const config = {
        'id'      : '720905681944080384', // the widget id
        'language': 'en' // the widget language
    };

    // fetch the data
    tweetFetcher(config)
        .then(function (tweets) {
            console.log('do something with the ', tweets);
            document.querySelector('section#tweets').insertAdjacentHTML('afterbegin', `<pre>${JSON.stringify(tweets, null, 4)}</pre>`);
        })
        .catch(function (err) {
            console.log(err);
        });
})();

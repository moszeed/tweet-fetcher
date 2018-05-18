(function () {
    'use strict';

    var _ = require('underscore');
    var htmlparser = require('htmlparser2');
    var domutils = require('domutils');

    var imageTypes = {
        'Avatar' : 'avatar',
        'NaturalImage-image': 'tweetImage'
    };

    function parseTweetContent (tweetNode) {

        var pTweetItems = domutils.getElementsByTagName ('p', tweetNode);

        var tweet = '';
        if (pTweetItems.length !== 0) {
            _.each(pTweetItems[0].children, function(tweetItemData) {

                if (!tweetItemData.data) {
                    _.each(tweetItemData.children, function(tweetItemDataChild) {
                        if (tweetItemDataChild.data) {
                            tweet = tweet + tweetItemDataChild.data;
                        } else {
                            _.each(tweetItemDataChild.children, function(tweetItemDataChildChild) {
                                tweet = tweet + tweetItemDataChildChild.data;
                            });
                        }
                    });


                } else {
                    tweet = tweet + tweetItemData.data;
                }
            });
        }

        return tweet;
    }

    function parseTweetImages (tweetNode) {

        var imgTweetItems = domutils.getElementsByTagName ('img', tweetNode);
        var images = [];
        _.each(imgTweetItems, function(imgItem) {

            var image = {};
                image.type = imageTypes[imgItem.attribs.class];
                image.src  = [];


            if (image.type === 'Identity-avatar Avatar u-photo') {
                return true;
            }

            if (imgItem.attribs['data-src-1x']) image.src.push(imgItem.attribs['data-src-1x']);
            if (imgItem.attribs['data-src-2x']) image.src.push(imgItem.attribs['data-src-2x']);

            if (imgItem.attribs['data-srcset']) {
                var splittedImages = decodeURIComponent(imgItem.attribs['data-srcset']).split(',');
                _.each(splittedImages, function(splittedImageItem) {
                    var splittedImageItemSplit = splittedImageItem.split(' ');
                    if (splittedImageItemSplit[0]) {
                        splittedImageItemSplit = splittedImageItemSplit[0];
                    }

                    if (splittedImageItemSplit.search('jpg:') === -1) {
                        image.src.push(splittedImageItemSplit);
                    }
                })
            }

            if (image.src.length !== 0) images.push(image);
        });

        return images;
    }

    function parseUserData (tweetNode) {

        var userData = {};
        var userDataSpans = domutils.getElementsByTagName('span', tweetNode);
        _.each(userDataSpans, function(userDataSpanItem) {

            if (userDataSpanItem.attribs &&
                userDataSpanItem.attribs.class.search('TweetAuthor') !== -1) {

                if (userDataSpanItem.attribs.class.search('TweetAuthor-name') !== -1) {
                    userData.name = userDataSpanItem.attribs.title;
                }

                if (userDataSpanItem.attribs.class.search('TweetAuthor-verifiedBadge') !== -1) {
                    userData.verified = true;
                }

                if (userDataSpanItem.attribs.class.search('TweetAuthor-screenName') !== -1) {
                    userData.screename = userDataSpanItem.attribs.title;
                }
            }
        });

        var userDataAElements = domutils.getElementsByTagName('a', tweetNode);
        _.each(userDataAElements, function(userDataAElementItem) {
            if (userDataAElementItem.attribs.class.search('TweetAuthor-link') !== -1) {
                userData.href = userDataAElementItem.attribs.href;
            }
        });

        return userData;
    }

    function parsePermaLinks (tweetNode) {

        var permaLink  = null;
        var permaLinks = domutils.getElementsByTagName('a', tweetNode);
        _.each(permaLinks, function(permaLinkItem) {

            if (permaLinkItem.attribs &&
                permaLinkItem.attribs.class.search('timeline-Tweet-timestamp') !== -1) {
                permaLink = permaLinkItem.attribs.href;
            }
        });

        return permaLink;
    }

    function parseUpdateTime (tweetNode) {

        var timeNodes      = domutils.getElementsByTagName('time', tweetNode);
        var timeAttributes = timeNodes[0].attribs;

        return {
            'datetime'       : timeAttributes.datetime,
            'timeAsText'     : timeAttributes.title,
            'timeAsTextShort': timeAttributes['aria-label']
        }
    }

    exports.parseTweets = function (body) {
        return new Promise(function (resolve, reject) {
            try {
                var handler = new htmlparser.DomHandler(function (error, dom) {
                    if (error) reject(error);
                    else {
                        var tweets = [];
                        var divs = domutils.getElementsByTagName('div', dom);

                        _.each(divs, function (divItem) {
                            if (divItem.attribs &&
                                divItem.attribs.class.search('timeline-Tweet ') !== -1) {
                                var tweet = {};
                                tweet.content = parseTweetContent(divItem);
                                tweet.images = parseTweetImages(divItem);
                                tweet.permaLink = parsePermaLinks(divItem);
                                tweet.time = parseUpdateTime(divItem);
                                tweet.user = parseUserData(divItem);

                                tweets.push(tweet);
                            }
                        });

                        resolve(tweets);
                    }
                });

                var parser = new htmlparser.Parser(handler);
                parser.write(body);
                parser.done();
            } catch (err) {
                reject(err);
            }
        });
    };
})();

var request = require('request');
var validator = require('validator');
var csv = require('to-csv');

var accountKey = '0f6S21H/vTHMNCCfAqrh3t7f+TKvNdXca+XYsOCnhP4';

function buildUrl(keyword, page) {
    // Base url for queries
    var page = page || 0;
    var url = 'https://api.datamarket.azure.com/Bing/SearchWeb/v1/Web?$skip='+page*50+'&$format=json&Query=%27';

    // Add the site
    url +='site:reddit.com/r/ "readers" NOT inbody:"moderators" NOT intitle:"over 18?" NOT instreamset:(url):"/comments/" NOT instreamset:(url):"/related/" NOT instreamset:(url):"/rising" NOT instreamset:(url):"/new" NOT instreamset:(url):"/top" NOT instreamset:(url):"/controvertial" NOT instreamset:(url):"/feeds" NOT instreamset:(url):"/theonetruegod" NOT instreamset:(url):"/fulltvshowsonyoutube"';

    if (keyword !== "") {
        // Add the keyword if there is one
        url += keyword + '%20';
    }

    url += '%27&Market=%27en-US%27&Adult=%27Off%27';

    return url;
}

function searchBing(res, resType, keyword, page) {
    var url = buildUrl(keyword, page);

    // Set up basic authentication for Bing's api
    var auth = 'Basic ' + new Buffer(accountKey + ':' + accountKey).toString('base64');

    var options = {
        headers: {
            'Authorization': auth
        },
        url: url
    };

    request(options, function(error, response, body) {
        if (!error && response.statusCode == 200) {
            var searchResults = [];

            // Convert the body into a usable object
            results = JSON.parse(body);
            results = results.d.results;

            // Step through all the results and store them
            for (var i = 0; i < results.length; i++) {
                var title = results[i].Title;
                var url = results[i].Url;

                title = title.replace('"', '');

                var result = {
                    "title": title,
                    "url": url
                };

                searchResults.push(result);
            }

            if (resType == 'json') {
                res.send(searchResults);
            } else if (resType == 'csv') {
                /*for (var i = 0; i < searchResults.length; i++) {
                    searchResults[i]['title'] = '"' + searchResults[i]['title'] + '"';
                    searchResults[i]['url'] = '"' + searchResults[i]['url'] + '"';
                }*/

                res.attachment('spreadsheet.csv');
                res.set('Content-Type', 'text/csv');
                res.send(csv(searchResults));
            }
        } else {
            // We couldn't request the url for some reason, give the user a error
            res.send(400, 'Something went wrong, please try again later.');
        }
    });
}

exports.search = function(req, res) {
            searchBing(res, req.body.resType, req.body.keyword, req.body.page);
};

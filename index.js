var qs = require('qs');
var helpers = require('./lib/helpers');

function processQuerystringItem(key, value) {
    value = helpers.replace_operator_values(value);
    if(value !== null) {
        filterQuery[key] = value;
    }
}

var filterQuery = {};

module.exports = {
    filter: function (request, options) {
        options = options || {};
        var prefix = options.prefix;
        var querystring;
        filterQuery = {};
        if(typeof request === 'string') {
            querystring = request;
        } else if(typeof request === 'object' && request.url && request.url.query) {
            querystring = request.url.query;
        } else {
            throw new Error('The first parameter should be a request object, or a querystring');
        }

        var qsParts = qs.parse(querystring);

        for(var key in qsParts) {
            if(qsParts.hasOwnProperty(key)) {
                // If there's a prefix defined, only pass through keys that start with the prefix
                if(options.prefix) {
                    if(!key.indexOf(options.prefix)) {
                        processQuerystringItem(key.substr(prefix.length), qsParts[key]);
                    }
                } else {
                    processQuerystringItem(key, qsParts[key]);
                }
            }
        }
        return filterQuery;
    }
};
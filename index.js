var qs = require('qs');
var helpers = require('./lib/helpers');

function processQuerystringItem(key, value) {
    var result;
    if(require("util").isArray(value)) {
        var processedValues = [];
        for(var i = 0; i < value.length; i++) {
            var subValue = helpers.replace_operator_values(value[i]);
            if(subValue) {
                result = {};
                result[key] = subValue;
                processedValues.push(result);
            }
        }
        return processedValues;
    } else {
        value = helpers.replace_operator_values(value);
        if(value !== null) {
            result = {};
            result[key] = value;
            return [result];
        }
    }
    return [];
}

module.exports = {

    extendOperators: function(operators){
        helpers.extendOperators(operators);
    },

    filter: function (request, options) {
        var filterQuery = {};
        options = options || {};
        var prefix = options.prefix;

        if(options.operators){
            helpers.extendOperators(options.operators);
        }

        var querystring;
        if(typeof request === 'string') {
            querystring = request;
        } else if(typeof request === 'object' && request.url && request.url.query) {
            querystring = request.url.query;
        } else {
            throw new Error('The first parameter should be a request object, or a querystring');
        }

        var qsParts = qs.parse(querystring);

        var conditions = [];
        var condition;
        for(var key in qsParts) {

            if(qsParts.hasOwnProperty(key)) {
                // If there's a prefix defined, only pass through keys that start with the prefix
                if(options.prefix) {
                    if(!key.indexOf(options.prefix)) {
                        conditions = conditions.concat(processQuerystringItem(key.substr(prefix.length), qsParts[key]));
                    }
                } else {
                    conditions = conditions.concat(processQuerystringItem(key, qsParts[key]));
                }
            }
        }

            // Now build the final object
            switch(conditions.length) {
                case 1:
                    filterQuery = conditions[0];
                    break;
                case 0:
                    break;
                default:
                    filterQuery.$and = conditions;
            }

        return filterQuery;
    }
};
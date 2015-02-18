var qs = require('qs');
var helpers = require('./lib/helpers');

function processQuerystringItem(fieldName, value) {
    var result;
    if(require("util").isArray(value)) {
        var processedValues = [];
        for(var i = 0; i < value.length; i++) {
            var subValue = helpers.replace_operator_values(value[i], fieldName);
            if(subValue.value) {
                result = {};
                result[fieldName] = subValue.value;
                processedValues.push(result);
            }
        }
        return processedValues;
    } else {
        value = helpers.replace_operator_values(value, fieldName);
        if(value.value !== null) {
            result = {};
            if(value.rename) {
                result[value.rename] = value.value;
            } else {
                result[fieldName] = value.value;
            }
            return [result];
        }
    }
    return [];
}

function processSortQuerystringItem(value) {
    var extractSort = function (val) {
        var spl = val.split("__");

        if(spl.length !== 2) {
            return null;
        }
        var key = spl[0];
        var order = spl[1];

        if(!isNaN(order)) {
            order = order * 1;
            if(order < 0) {
                order = -1;
            } else if(order > 0) {
                order = 1;
            } else {
                return null;
            }
        } else {
            order = order.toLowerCase();
            if(order === "asc") {
                order = 1;
            } else if(order == "desc") {
                order = -1
            } else {
                return null;
            }
        }
        return [key, order];
    }
    var result;
    if(require("util").isArray(value)) {
        var processedValues = [];
        for(var i = 0; i < value.length; i++) {
            result = extractSort(value[i]);
            if(result) {
                processedValues.push(result);
            }
        }
        if(processedValues.length) {
            return processedValues;
        }
    } else {

        result = extractSort(value);
        if(result) {
            return [result];
        }
    }
    return null;
}

module.exports = {

    extendOperators: function (operators) {
        helpers.extendOperators(operators);
    },

    filter: function (request, options) {
        var filterQuery = {};
        options = options || {};
        var prefix = options.prefix;

        if(options.operators) {
            helpers.extendOperators(options.operators);
        }

        var querystring;
        if(typeof request === 'string') {
            querystring = request;
        } else if(typeof request === 'object' && request) {
            if(request.url && request.url.query) {
                querystring = request.url.query;
            }else{
                querystring = request;
            }
        } else {
            throw new Error('The first parameter should be an object, a request object, or a querystring');
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
    },
    sort: function (request, options) {
        var sortQuery = [];
        options = options || {};
        var prefix = options.prefix;

        var querystring;
        if(typeof request === 'string') {
            querystring = request;
        } else if(typeof request === 'object' && request.url && request.url.query) {
            querystring = request.url.query;
        } else {
            throw new Error('The first parameter should be a request object, or a querystring');
        }

        var qsParts = qs.parse(querystring);

        var sortItems = [];
        var sortItem;
        for(var key in qsParts) {
            if(qsParts.hasOwnProperty(key)) {
                // If there's a prefix defined, only pass through keys that start with the prefix
                if(options.prefix) {
                    if(!key.indexOf(options.prefix)) {
                        sortItem = processSortQuerystringItem(qsParts[key]);
                        if(sortItem) {
                            sortItems = sortItems.concat(sortItem);
                        }
                    }
                } else {
                    sortItem = processSortQuerystringItem(qsParts[key]);
                    if(sortItem) {
                        sortItems = sortItems.concat(sortItem);
                    }
                }
            }
        }
        if(sortItems.length) {

            return sortItems;
        }
        return null;
    }
};
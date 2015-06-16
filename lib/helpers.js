var _extendedOps = null;
function extractRelativeDate(value) {
    var re = /^(\-)?(\d*)(mins?|minutes?|hrs?|hours?|weeks?|days?|years?|now)/i

    var result = re.exec(value);

    if(result) {
        var sign = result[1];
        var val = result[2] * 1;
        var units = result[3];
        var diff = val * (sign === "-" ? -1 : 1);
        var mult;

        switch(units.toLowerCase()) {

            case "now":
                mult = 1;
                break

            case "minute":
            case "minutes":
            case "min":
            case "mins":
                mult = 1000 * 60;
                break
            case "hrs":
            case "hr":
            case "hours":
            case "hour":
                mult = 1000 * 60 * 60;
                break;
            case "day":
            case "days":
                mult = 1000 * 60 * 60 * 24;
                break;
            case "week":
            case "weeks":
                mult = 1000 * 60 * 60 * 24 * 7;
                break;
            case "year":
            case "years":
                mult = 1000 * 60 * 60 * 24 * 365;
                break;
        }

        diff = diff * mult;
        return new Date((new Date() * 1) + diff);

    } else {
        return null;
    }

}
var self = {
    extendOperators: function (operators) {
        _extendedOps = operators;
    },
    cleanItem: function (value, op) {
        if(!isNaN(value) && value !== true && value !== false && op !== 'streq' && op !== 'strin' && op !== 'strnin') {
            value = value * 1;
        }
        return value;
    },

    replace_operator_values: function (value, fieldName) {
        var op;
        var rtn = {value: null};


        if(typeof value !== 'string'){
                   if(isNaN(value)) {
                       return rtn;
                   } else {
                       value = value + '';
                   }
        }

        if(value === ''){
            return rtn;
        }

        if(!value.indexOf("__")) {
            var match = value.match(/__([^_]*?)_(.*)/);

            if(match && match.length === 3) {
                op = match[1].toLowerCase();
                value = match[2];
                value = self.cleanItem(value, op);
                var ops = {
                    "lte": self.values.simpleValue,
                    "gte": self.values.simpleValue,
                    "lt": self.values.simpleValue,
                    "gt": self.values.simpleValue,
                    "dtlte": self.values.dateValue,
                    "dtgte": self.values.dateValue,
                    "dtlt": self.values.dateValue,
                    "dtgt": self.values.dateValue,
                    "dteq": self.values.dateValue,
                    "streq": self.values.stringValue,
                    "ne": self.values.simpleValue,
                    "exists": self.values.booleanValue,
                    "bool": self.values.booleanValue,
                    "or": self.values.arrayValue,
                    "in": self.values.arrayValue,
                    "nin": self.values.arrayValue,
                    "all": self.values.arrayValue,
                    "strin": self.values.arrayStringValue,
                    "strnin": self.values.arrayStringValue,
                    "elemmatch": self.values.elemMatch
                };

                if(_extendedOps && _extendedOps[op] && typeof _extendedOps[op].fn === 'function') {
                    var operator = _extendedOps[op];
                    var ns = operator.ns || '$' + op;
                    // Allow for a function to define the name
                    if(typeof ns === 'function') {
                        ns = ns(value, op, operator);
                    }
                    var val = {};
                    val[ns] = operator.fn(value, self, op);

                    // If required, rename the field we're assigning into.
                    if(typeof operator.rename === 'string') {
                        rtn.rename = operator.rename;
                    } else if(typeof operator.rename === 'function') {
                        rtn.rename = operator.rename(fieldName, value, self, op, val);
                    }


                    if(operator.negate){
                        val = {$not: val};
                    }

                    value = val;
                } else {
                    if(ops[op]) {
                        var val = {};

                        switch(op) {
                            case "elemmatch":
                                val['$elemMatch'] = ops[op](value);
                                break;
                            case "dtlte":
                            case "dtgte":
                            case "dtgt":
                            case "dtlt":
                                val['$' + op.substr(2)] = ops[op](value);
                                break;
                            case "dteq":
                                val = ops[op](value);
                                break;
                            case "streq":
                                val = ops[op](value);
                                break;

                            case "elemmatch":
                                val['$elemMatch'] = ops[op](value);
                                break;

                            case "bool":
                                val = ops[op](value);
                                break;

                            case "strin":
                                val['$in'] = ops[op](value);
                                break;

                            case "strnin":
                                val['$nin'] = ops[op](value);
                                break;

                            default:
                                val['$' + op] = ops[op](value);
                                break;
                        }
                        value = val;
                    }
                }
            }
        }
        rtn.value = self.cleanItem(value, op);
        return rtn;
    },
    values: {
        simpleValue: function (value) {
            return value
        },
        stringValue: function (value) {
            return value + "";
        },
        arrayValue: function (value) {
            var items = (value + '').split('||');
            items = items.map(self.cleanItem);
            return items;
        },
        arrayStringValue: function (value) {
            var items = (value + '').split('||');
            items = items.map(function (item, i) {
                return self.cleanItem(item, "strin");
            });
            return items;
        },
        elemMatch: function (value) {
            var items = (value + "").split(",");
            var out = {}
            var found = false;
            for(var i = 0; i < items.length; i++) {
                var subitem = items[i];
                var match = subitem.match(/(.*?)(__[^_]*?_.*)/);
                if(match && match.length === 3) {
                    var val = self.replace_operator_values(match[2]);
                    out[match[1]] = val.value;
                    found = true;
                }
            }
            return found ? out : null;
        },
        booleanValue: function (value) {
            switch((value + '').toLowerCase()) {
                case "true":
                case "yes":
                case "1":
                    return true;
                case "false":
                case "no":
                case "0":
                case null:
                    return false;
                default:
                    return Boolean(value);
            }
        },
        dateValue: function (value) {
            var dt;
            if(typeof value === "string") {

                var relative = extractRelativeDate(value);
                if(relative) {
                    return relative;
                }
                dt = new Date(value);
                return dt;

            }

            return value;
        }
    }
};

module.exports = self;
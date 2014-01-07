var _extendedOps = null;
var self = {
    extendOperators: function (operators) {
        _extendedOps = operators;
    },
    cleanItem: function (value) {
        if(!isNaN(value)) {
            value = value * 1;
        }
        return value;
    },

    replace_operator_values: function (value) {
        var op;

        if(value === "") {
            return null;
        }
        if(!value.indexOf("__")) {
            var match = value.match(/__([^_]*?)_(.*)/);

            if(match && match.length === 3) {
                op = match[1].toLowerCase();
                value = match[2];
                value = self.cleanItem(value);
                var ops = {
                    "lte": self.values.simpleValue,
                    "gte": self.values.simpleValue,
                    "lt": self.values.simpleValue,
                    "gt": self.values.simpleValue,
                    "ne": self.values.simpleValue,
                    "or": self.values.arrayValue,
                    "in": self.values.arrayValue,
                    "elemmatch": self.values.elemMatch
                };

                if(_extendedOps && _extendedOps[op] && typeof _extendedOps[op].fn === 'function') {
                    var operator = _extendedOps[op];
                    var ns = operator.ns || '$' + op;
                    // Allow for a function to define the name
                    if(typeof ns === 'function'){
                        ns = ns(value,op, operator);
                    }
                    var val = {};
                    val[ns] = operator.fn(value, self);
                    value = val;
                } else {
                    if(ops[op]) {
                        var val = {};
                        if(op === "elemmatch") {
                            val['$elemMatch'] = ops[op](value);
                        } else {
                            val['$' + op] = ops[op](value);
                        }
                        value = val;
                    }
                }
            }
        }
        return self.cleanItem(value);
    },
    values: {
        simpleValue: function (value) {
            return value
        },
        arrayValue: function (value) {
            var items = (value + '').split('||');
            items = items.map(self.cleanItem);
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
                    out[match[1]] = val;
                    found = true;
                }
            }
            return found ? out : null;
        }
    }
};

module.exports = self;
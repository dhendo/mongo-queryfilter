var self = {

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
                    "in": self.values.arrayValue
                };

                if(ops[op]) {
                    var val = {};
                    val['$' + op] = ops[op](value);
                    value = val;
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
        }}
};

module.exports = self;
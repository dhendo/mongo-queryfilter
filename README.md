mongo-queryfilter
=================

Generate an object suitable for use as a a mongo query from a querystring or request object.

The filter function takes either a node http request object or a string containing the "query" portion of the request (e.g. "param=foo&param2=bar"). Numeric values will be cast as appropriate.




## Options



```javascript
var querystring = '_p_value=bob';
var options = {
    "prefix": "_p_" // Optional prefix for the key names. If present only keys starting with the prefix will be passed through
};
var result = require('mongo-queryfilter').filter(querystring, options);
```

## Examples


### Simple Equality
```javascript
var querystring = 'value=bob';
var result = require('mongo-queryfilter').filter(querystring);
```
Output:
```javascript
{value: "bob"}
```

### Inequality
```javascript
var querystring = 'value=__ne_bob';
var result = require('mongo-queryfilter').filter(querystring);
```
Output:
```javascript
{value: {$ne: "bob"}}
```


### Greater Than
```javascript
var querystring = 'value=__gt_5;
var result = require('mongo-queryfilter').filter(querystring);
```
Output:
```javascript
{value: {$gt: 5}}
```

The same applies to "\__lt_" "\__gte_" "\__lte_" (<, >= AND <=)


### In
```javascript
var querystring = 'value=__in_alice||bob';
var result = require('mongo-queryfilter').filter(querystring);
```
Output:
```javascript
{value: {$in: ['alice', 'bob']}}
```

### Or
```javascript
var querystring = 'value=__or_alice||bob';
var result = require('mongo-queryfilter').filter(querystring);
```
Output:
```javascript
{value: {$or: ['alice', 'bob']}}
```


### ElemMatch
```javascript
var querystring = 'array="__elemMatch_alice__eq_a,bob__gt_1';
var result = require('mongo-queryfilter').filter(querystring);
```
Output:
```javascript
{array: {$elemMatch: {alice: 'a', bob: {$gt: 1}]}}
```

### ElemMatch with $in
```javascript
var querystring = 'array="__elemMatch_id__in_a||b,bob__gt_1';
var result = require('mongo-queryfilter').filter(querystring);
```
Output:
```javascript
{array: {$elemMatch: {id: {$in: ['a', 'b']}, bob: {$gt: 1}]}}
```


### Define new operators
```javascript
// define a function that returns an operator $thing, that doubles the value
var thingfn = function(value, helpers, operatorName){
    return value * 2;
};

var result = require('mongo-queryfilter').filter('extra.color=red&price=__thing_2', {operators: {'thing': {'fn': thingfn, 'ns': '$thing'}}});
```
Output:
```javascript
{"extra.color": "red", price: {$thing: 4}]}}

// Note that $thing isn't valid in mongo, just an example - this will allow you to inject more complicated operators
```

### Multiple Conditions

You can apply multiple conditions to the same key to create ranges:

```javascript
var querystring = 'value=__gt_1&value=__lt_10';
var result = require('mongo-queryfilter').filter(querystring);
```
Output:
```javascript
{$and: [{value: {$gt: 1}},{value: {$lt: 10}}]}
```







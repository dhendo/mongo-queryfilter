mongo-queryfilter
=================

Generate an object suitable for use as a a mongo query from a querystring or request object.

The filter function takes either a node http request object or a string containing the "query" portion of the request (e.g. "param=foo&param2=bar"). Numeric values will be cast as appropriate.

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






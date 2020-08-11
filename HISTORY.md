History
=======

####2020-08-04 v0.1.20
Allow the result to be returned in the $and form even if there is only one condition by passing {forceand: true} in the options @dhendo

####2020-08-04 v0.1.19
Dependabot upgrade of qs @dhendo

####2020-08-04 v0.1.18
Allow operators to request to be returned without a namespace. useful for e.g. $text @dhendo

####2019-08-08 v0.1.16
Add "range" and "nrange" operators @jake314159

####2016-11-18 v0.1.15
Allow extended operators to specify their own clean function @jake314159

####2016-02-11 v0.1.14
Apply rename when using multiple filters @jake314159

####2015-10-26 v0.1.13
Bumped qsversion @dhendo

####2015-09-25 v0.1.12
Disallow nulls for certain operators @jake314159

####2015-08-12 v0.1.11
Pass fieldname to operator function @jake314159

####2015-06-16 v0.1.10
Add support for $all

####2015-02-19 v0.1.9
Bugfixes to allow raw objects to pass in arrays / numbers correctly

####2015-02-18 v0.1.7
Allow a raw object to be passed in. Flatten deep object properties.

####2014-11-12 v0.1.5
Allow custom operators to inline a $not to negate the section of the query

####2014-10-20 v0.1.4
Allow custom operators to override the key of the field that is being operated on.

####2014-09-05 v0.1.3
Added strin and strnin operators to avoid casting to a number (e.g. "007" does not get casted to 7) for in queries

####2014-04-21 v0.1.2
Added streq operator to avoid casting to a number (e.g. "007" does not get casted to 7)

####2014-04-24 v0.1.1
Switched order separator from _ to __

####2014-04-24 v0.1.0
Added sort function.
Added testing on Travis.

####2014-04-16 v0.0.9
Add in coercion to booleans with _bool.

####2014-03-19 v0.0.8
Fix relative date filtering - was returning a timestamp rather than a date object

####2014-02-19 v0.0.7

Add relative and absolute date filtering
Add support for $exists operator

####2014-02-19 v0.0.6

Add nin operator (MikeTheTechie)

####2014-01-07 v0.0.5

Pass the operator through to custom filters

####2014-01-07 v0.0.4

Added the ability to generate an elemMatch
Added the ability to inject operators. This allows for more complicated expansions / aliases / calculations.

####2013-10-24 v0.0.3

Added fix for dotted notation.

####2013-10-23 v0.0.2 

Allow multiple conditions to be applied to the same key.

####2013-10-22 v0.0.1

Initial version

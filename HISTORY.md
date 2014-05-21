History
=======

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

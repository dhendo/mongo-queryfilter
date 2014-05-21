var should = require('should');

var qf = require('../index.js');

suite('The filter', function () {
    suiteSetup(function (done) {
        done();
    });

    setup(function (done) {
        qf.extendOperators(null);
        done();
    });

    test('should exist', function (done) {
        should.equal(typeof qf, 'object');
        should.equal(typeof qf.filter, 'function');
        done();
    });

    test('should generate for a simple equality', function (done) {
        var out = qf.filter('value=bob');
        should.exist(out);
        out.should.have.property('value', 'bob');
        done();
    });

    test('should generate for an or', function (done) {
        var out = qf.filter('value=__or_alice||bob||5');
        should.exist(out);
        out.should.have.property('value');
        out.value.should.have.property('$or');
        out.value.$or.should.include('alice');
        out.value.$or.should.include('bob');
        out.value.$or.should.include(5);
        done();
    });

    test('should generate for an in', function (done) {
        var out = qf.filter({url: {query: {value: "__in_alice||bob"}}});
        should.exist(out);
        out.should.have.property('value');
        out.value.should.have.property('$in');
        out.value.$in.should.include('alice');
        out.value.$in.should.include('bob');
        done();
    });


    test('should generate for an nin', function (done) {
        var out = qf.filter({url: {query: {value: "__nin_alice||bob"}}});
        should.exist(out);
        out.should.have.property('value');
        out.value.should.have.property('$nin');
        out.value.$nin.should.include('alice');
        out.value.$nin.should.include('bob');
        done();
    });


    test('should generate for an elemMatch', function (done) {
        var out = qf.filter({url: {query: {array: "__elemMatch_alice__eq_a,bob__gt_1"}}});
        should.exist(out);
        out.should.have.property('array');
        out.array.should.have.property('$elemMatch');
        out.array.$elemMatch.should.have.property("alice", "a")
        out.array.$elemMatch.should.have.property('bob');
        out.array.$elemMatch.bob.should.have.property('$gt', 1);
        done();
    });

    test('should generate for an elemMatch with an in', function (done) {
        var out = qf.filter({url: {query: {cat: "__elemMatch_id__in_a||b,bob__gt_1"}}});
        should.exist(out);
        out.should.have.property('cat');
        out.cat.should.have.property('$elemMatch');
        out.cat.$elemMatch.should.have.property("id");
        out.cat.$elemMatch.id.should.have.property("$in");
        out.cat.$elemMatch.id.$in.should.include("a");
        out.cat.$elemMatch.id.$in.should.include("b");
        out.cat.$elemMatch.should.have.property('bob');
        out.cat.$elemMatch.bob.should.have.property('$gt', 1);
        done();
    });

    test('should generate for a lte', function (done) {
        var out = qf.filter('value=__lte_5');
        should.exist(out);
        out.should.have.property('value');
        out.value.should.have.property('$lte', 5);
        done();
    });

    test('should generate for a gte', function (done) {
        var out = qf.filter('value=__gte_5');
        should.exist(out);
        out.should.have.property('value');
        out.value.should.have.property('$gte', 5);
        done();
    });
    test('should generate for a lt', function (done) {
        var out = qf.filter('value=__lt_5');
        should.exist(out);
        out.should.have.property('value');
        out.value.should.have.property('$lt', 5);
        done();
    });

    test('should generate for a gt', function (done) {
        var out = qf.filter('value=__gt_5');
        should.exist(out);
        out.should.have.property('value');
        out.value.should.have.property('$gt', 5);
        done();
    });

    test('should generate for a streq', function (done) {
        var out = qf.filter('value=__streq_000000007');
        should.exist(out);
        out.value.should.equal("000000007");
        done();
    });

    test('should generate for a bool true', function (done) {
        var out = qf.filter('value=__bool_true');
        should.exist(out);
        out.should.have.property('value');
        out.value.should.be.true;

        done();
    });
    test('should generate for a bool false', function (done) {
        var out = qf.filter('value=__bool_false');
        should.exist(out);
        out.should.have.property('value');
        out.value.should.be.false;
        done();
    });
    test('should generate for a bool 1', function (done) {
        var out = qf.filter('value=__bool_1');
        should.exist(out);
        out.should.have.property('value');
        out.value.should.be.true;

        done();
    });
    test('should generate for a bool 0', function (done) {
        var out = qf.filter('value=__bool_0');
        should.exist(out);
        out.should.have.property('value');
        out.value.should.be.false;
        done();
    });

    test('should generate for a ne', function (done) {
        var out = qf.filter('value=__ne_5');
        should.exist(out);
        out.should.have.property('value');
        out.value.should.have.property('$ne', 5);
        done();
    });

    test('should generate for an exists true', function (done) {
        var out = qf.filter('value=__exists_true');
        should.exist(out);
        out.should.have.property('value');
        out.value.should.have.property('$exists', true);
        done();
    });
    test('should generate for an exists', function (done) {
        var out = qf.filter('value=__exists_false');
        should.exist(out);
        out.should.have.property('value');
        out.value.should.have.property('$exists', false);
        out.value.$exists.should.be.false;
        done();
    });

    test('should generate for an exists 0', function (done) {
        var out = qf.filter('value=__exists_0');
        should.exist(out);
        out.should.have.property('value');
        out.value.should.have.property('$exists', false);
        out.value.$exists.should.be.false;
        done();
    });

    test('should generate for an exists 1', function (done) {
        var out = qf.filter('value=__exists_1');
        should.exist(out);
        out.should.have.property('value');
        out.value.should.have.property('$exists', true);
        out.value.$exists.should.be.true;
        done();
    });

    test('should generate for an exists yes', function (done) {
        var out = qf.filter('value=__exists_yes');
        should.exist(out);
        out.should.have.property('value');
        out.value.should.have.property('$exists', true);
        done();
    });

    test('should generate for an exists no', function (done) {
        var out = qf.filter('value=__exists_no');
        should.exist(out);
        out.should.have.property('value');
        out.value.should.have.property('$exists', false);
        done();
    });

    test('should not filter for an empty value', function (done) {
        var out = qf.filter('value=');
        should.exist(out);
        out.should.not.have.property('value');
        done();
    });

    test('should generate for a range on a single variable', function (done) {
        var out = qf.filter('value=__gt_5&value=__lte_10');
        should.exist(out);
        out.should.have.property('$and');
        out.$and.should.have.length(2);
        out.$and[0].should.have.property("value");
        out.$and[0].value.should.have.property('$gt', 5);
        out.$and[1].should.have.property("value");
        out.$and[1].value.should.have.property('$lte', 10);
        done();
    });

    test('should work with many conditions', function (done) {
        var out = qf.filter('value=__gt_5&value=__lte_10&foo=bar');
        should.exist(out);
        out.should.have.property('$and');
        out.$and.should.have.length(3);
        out.$and[0].should.have.property("value");
        out.$and[0].value.should.have.property('$gt', 5);
        out.$and[1].should.have.property("value");
        out.$and[1].value.should.have.property('$lte', 10);
        out.$and[2].should.have.property("foo", "bar");
        done();
    });
    test('should work with many conditions inc equality', function (done) {
        var out = qf.filter('value=5&value=__lte_10&foo=bar');
        should.exist(out);
        out.should.have.property('$and');
        out.$and.should.have.length(3);
        out.$and[0].should.have.property("value", 5);
        out.$and[1].should.have.property("value");
        out.$and[1].value.should.have.property('$lte', 10);
        out.$and[2].should.have.property("foo", "bar");
        done();
    });

    test('should generate for a simple equality', function (done) {
        var out = qf.filter('value=bob');
        should.exist(out);
        out.should.have.property('value', 'bob');
        done();
    });
    test('should generate for a dotted value', function (done) {
        var out = qf.filter('extra.color=red&price=__gt_2');
        should.exist(out);
        out.should.have.property('$and');
        out.$and.should.have.length(2);
        out.$and[0].should.have.property("extra.color", "red");
        out.$and[1].should.have.property('price');
        out.$and[1].price.should.have.property('$gt', 2);
        done();
    });

    test('should generate for a dotted value with an underscore', function (done) {
        var out = qf.filter('extra.color_name=red&price=__gt_2');
        should.exist(out);
        out.should.have.property('$and');
        out.$and.should.have.length(2);
        out.$and[0].should.have.property("extra.color_name", "red");
        out.$and[1].should.have.property('price');
        out.$and[1].price.should.have.property('$gt', 2);
        done();
    });

    test('should allow a new operator to be defined', function (done) {

        // define a function that returns an operator $thing, that doubles the value
        var thingfn = function(value, helpers, operatorName){
            return value * 2;  // You can call helpers.replace_operator_values to recursively generate fragments.
        };

        var out = qf.filter('extra.color=red&price=__thing_2', {operators: {'thing': {'fn': thingfn, 'ns': '$thing'}}});
        should.exist(out);
        out.should.have.property('$and');
        out.$and.should.have.length(2);
        out.$and[0].should.have.property("extra.color", "red");
        out.$and[1].should.have.property('price');
        out.$and[1].price.should.have.property('$thing', 4);
        done();
    });


    test('should allow a new operator to be defined beforehand', function (done) {

        // define a function that returns an operator $thing, that doubles the value
        var thingfn = function(value, helpers, operatorName){
            return value * 2;
        };
        // Set for the lifetime of qf
        qf.extendOperators({'thing': {'fn': thingfn, 'ns': '$thing'}});
        var out = qf.filter('extra.color=red&price=__thing_2');
        should.exist(out);
        out.should.have.property('$and');
        out.$and.should.have.length(2);
        out.$and[0].should.have.property("extra.color", "red");
        out.$and[1].should.have.property('price');
        out.$and[1].price.should.have.property('$thing', 4);
        done();
    });
});

suite('Prefixing', function () {
    suiteSetup(function (done) {
        done();
    });

    setup(function (done) {
        done();
    });

    test('should only allow values with the correct prefix', function (done) {
        var out = qf.filter('value=__gt_5.5&__f_val2=7', {prefix: "__f_"});
        should.exist(out);
        out.should.have.property('val2', 7);
        done();
    });
});

suite('Date filtering', function () {
    suiteSetup(function (done) {
        done();
    });

    setup(function (done) {
        done();
    });

    test('should generate for a dtlte', function (done) {
        var out = qf.filter('value=__dtlte_2014-01-01');
        should.exist(out);
        out.should.have.property('value');
        out.value.should.have.property('$lte');
        (out.value.$lte*1).should.equal(new Date("2014-01-01") *1);
        done();
    });
    test('should generate for a dtgte', function (done) {
        var out = qf.filter('value=__dtgte_2014-01-01');
        should.exist(out);
        out.should.have.property('value');
        out.value.should.have.property('$gte');
        (out.value.$gte*1).should.equal(new Date("2014-01-01") *1);
        done();
    });

    test('should generate for a dtgt', function (done) {
        var out = qf.filter('value=__dtgt_2014-01-01');
        should.exist(out);
        out.should.have.property('value');
        out.value.should.have.property('$gt');
        (out.value.$gt*1).should.equal(new Date("2014-01-01") *1);
        done();
    });

    test('should generate for a dtlt', function (done) {
        var out = qf.filter('value=__dtlt_2014-01-01');
        should.exist(out);
        out.should.have.property('value');
        out.value.should.have.property('$lt');
        (out.value.$lt*1).should.equal(new Date("2014-01-01") *1);
        done();
    });

    test('should generate for a dteq', function (done) {
        var out = qf.filter('value=__dteq_2014-01-01');
        should.exist(out);
        (out.value*1).should.equal(new Date("2014-01-01") *1);
        done();
    });





    /*
        Allow epoch timestamps
     */

    test('should generate for a dtlte epoch', function (done) {
        var out = qf.filter('value=__dtlte_1388534400000');
        should.exist(out);
        out.should.have.property('value');
        out.value.should.have.property('$lte');
        (out.value.$lte*1).should.equal(new Date("2014-01-01") *1);
        done();
    });
    test('should generate for a dtgte epoch', function (done) {
        var out = qf.filter('value=__dtgte_1388534400000');
        should.exist(out);
        out.should.have.property('value');
        out.value.should.have.property('$gte');
        (out.value.$gte*1).should.equal(new Date("2014-01-01") *1);
        done();
    });

    test('should generate for a dtgt epoch', function (done) {
        var out = qf.filter('value=__dtgt_1388534400000');
        should.exist(out);
        out.should.have.property('value');
        out.value.should.have.property('$gt');
        (out.value.$gt*1).should.equal(new Date("2014-01-01") *1);
        done();
    });

    test('should generate for a dtlt epoch', function (done) {
        var out = qf.filter('value=__dtlt_1388534400000');
        should.exist(out);
        out.should.have.property('value');
        out.value.should.have.property('$lt');
        (out.value.$lt*1).should.equal(new Date("2014-01-01") *1);
        done();
    });

    test('should generate for a dteq epoch', function (done) {
        var out = qf.filter('value=__dteq_1388534400000');
        should.exist(out);
        (out.value*1).should.equal(new Date("2014-01-01") *1);
        done();
    });




    /*
        Work with relative date times
     */

    test('should generate for a dtlte relative', function (done) {
          var out = qf.filter('value=__dtlte_-2hrs');
          should.exist(out);
          out.should.have.property('value');
          out.value.should.have.property('$lte');
          (out.value.$lte*1).should.be.approximately(new Date()*1 - (1000*60*60*2), 1000);
          done();
      });
    test('should generate for a dtlte relative', function (done) {
          var out = qf.filter('value=__dtlte_2hrs');
          should.exist(out);
          out.should.have.property('value');
          out.value.should.have.property('$lte');
          (out.value.$lte*1).should.be.approximately(new Date()*1 + (1000*60*60*2), 1000);
          done();
      });
    test('should generate for a dtlte relative', function (done) {
          var out = qf.filter('value=__dtlte_2days');
          should.exist(out);
          out.should.have.property('value');
          out.value.should.have.property('$lte');
          (out.value.$lte*1).should.be.approximately(new Date()*1 + (1000*60*60*48), 1000);
          done();
      });
    test('should generate for a dtlte relative', function (done) {
          var out = qf.filter('value=__dtlte_2weeks');
          should.exist(out);
          out.should.have.property('value');
          out.value.should.have.property('$lte');
          (out.value.$lte*1).should.be.approximately(new Date()*1 + (1000*60*60*24*14), 1000);
          done();
      });
    test('should generate for a dtlte relative now', function (done) {
          var out = qf.filter('value=__dtlte_now');
          should.exist(out);
          out.should.have.property('value');
          out.value.should.have.property('$lte');
          (out.value.$lte*1).should.be.approximately(new Date()*1, 1000);
          done();
      });
});

suite('The filter values', function () {
    suiteSetup(function (done) {
        done();
    });

    setup(function (done) {
        done();
    });

    test('should cope with decimals', function (done) {
        var out = qf.filter('value=__gt_5.5');
        should.exist(out);
        out.should.have.property('value');
        out.value.should.have.property('$gt', 5.5);
        done();
    });

    test('should cope with strings', function (done) {
        var out = qf.filter('value=__ne_alice');
        should.exist(out);
        out.should.have.property('value');
        out.value.should.have.property('$ne', "alice");
        done();
    });

    test('should not allow object injection', function (done) {
        var out = qf.filter('value={$where: {"a": "b"}}');
        should.exist(out);
        out.should.have.property('value', '{$where: {"a": "b"}}');
        done();
    });

});


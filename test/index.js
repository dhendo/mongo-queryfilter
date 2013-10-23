var should = require('should');

var qf = require('../index.js');

suite('The filter', function () {
    suiteSetup(function (done) {
        done();
    });

    setup(function (done) {
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

        test('should generate for a ne', function (done) {
            var out = qf.filter('value=__ne_5');
            should.exist(out);
            out.should.have.property('value');
            out.value.should.have.property('$ne', 5);
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


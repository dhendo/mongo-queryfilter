var should = require('should');

var qf = require('../index.js');

suite('The sorting function', function () {
    suiteSetup(function (done) {
        done();
    });

    setup(function (done) {
        qf.extendOperators(null);
        done();
    });

    test('should exist', function (done) {
        should.equal(typeof qf, 'object');
        should.equal(typeof qf.sort, 'function');
        done();
    });

    test('should generate for a single sort', function (done) {
        var out = qf.sort('sort=dt__-1');
        should.exist(out);
        out.should.be.an.Array.and.have.length(1);
        out[0].should.be.an.Array.and.have.length(2);
        out[0][0].should.equal("dt");
        out[0][1].should.equal(-1);
        done();
    });

    test('should generate for a double sort', function (done) {
        var out = qf.sort('sort=dt__-1&sort=name__1');
        should.exist(out);
        out.should.be.an.Array.and.have.length(2);
        out[0].should.be.an.Array.and.have.length(2);
        out[0][0].should.equal("dt");
        out[0][1].should.equal(-1);

        out[1].should.be.an.Array.and.have.length(2);
        out[1][0].should.equal("name");
        out[1][1].should.equal(1);
        done();
    });
    test('should ignore bogus values', function (done) {
        var out = qf.sort('sort=dt__-1&sort=name__1&sort=bad__something');
        should.exist(out);
        out.should.be.an.Array.and.have.length(2);
        out[0].should.be.an.Array.and.have.length(2);
        out[0][0].should.equal("dt");
        out[0][1].should.equal(-1);

        out[1].should.be.an.Array.and.have.length(2);
        out[1][0].should.equal("name");
        out[1][1].should.equal(1);
        done();
    });
    test('should support asc and desc', function (done) {
        var out = qf.sort('sort=dt__desc&sort=name__asc');
        should.exist(out);
        out.should.be.an.Array.and.have.length(2);
        out[0].should.be.an.Array.and.have.length(2);
        out[0][0].should.equal("dt");
        out[0][1].should.equal(-1);

        out[1].should.be.an.Array.and.have.length(2);
        out[1][0].should.equal("name");
        out[1][1].should.equal(1);
        done();
    });
    test('should support asc and desc non sensitive', function (done) {
        var out = qf.sort('sort=dt__dESc&sort=name__ASc');
        should.exist(out);
        out.should.be.an.Array.and.have.length(2);
        out[0].should.be.an.Array.and.have.length(2);
        out[0][0].should.equal("dt");
        out[0][1].should.equal(-1);

        out[1].should.be.an.Array.and.have.length(2);
        out[1][0].should.equal("name");
        out[1][1].should.equal(1);
        done();
    });

    test('should support any numbers', function (done) {
        var out = qf.sort('sort=dt__-3.141&sort=name__4700000&other=0');
        should.exist(out);
        out.should.be.an.Array.and.have.length(2);
        out[0].should.be.an.Array.and.have.length(2);
        out[0][0].should.equal("dt");
        out[0][1].should.equal(-1);

        out[1].should.be.an.Array.and.have.length(2);
        out[1][0].should.equal("name");
        out[1][1].should.equal(1);
        done();
    });

    test('should support any numbers', function (done) {
        var out = qf.sort('sort=dt__-3.141&sort=name__4700000&other=0');
        should.exist(out);
        out.should.be.an.Array.and.have.length(2);
        out[0].should.be.an.Array.and.have.length(2);
        out[0][0].should.equal("dt");
        out[0][1].should.equal(-1);

        out[1].should.be.an.Array.and.have.length(2);
        out[1][0].should.equal("name");
        out[1][1].should.equal(1);
        done();
    });
    test('should ignore bad values', function (done) {
        var out = qf.sort('sort=-1&sort=name_____&sort=');
        should.not.exist(out);
        done();
    });
    test('should respect a prefix', function (done) {
        var out = qf.sort('sort=-1&sort=name____&sort=', {prefix: "__"});
        should.not.exist(out);
        done();
    });

    test('should only allow prefixed items through', function (done) {
        var out = qf.sort('__sort=dt__-1&__sort=name__1&sort=other__1', {prefix: "__"});
        should.exist(out);
        out.should.be.an.Array.and.have.length(2);
        out[0].should.be.an.Array.and.have.length(2);
        out[0][0].should.equal("dt");
        out[0][1].should.equal(-1);

        out[1].should.be.an.Array.and.have.length(2);
        out[1][0].should.equal("name");
        out[1][1].should.equal(1);
        done();
    });


});


'use strict';

var fs = require('fs');

var path = require('path');

var test = require('tape');

var gulp = require('gulp');

var through2 = require('through2');

var purescript = require('../');

test('psc - basic', function(t){
  t.plan(1);

  var fixture = './test/Fixture1.purs';

  var stream = purescript.psc({src: fixture});

  stream.pipe(through2.obj(function(chunk, encoding, callback){
    t.pass('should output a compiled result');
    callback();
  }));
});

test('psc - error', function(t){
  t.plan(2);

  var fixture = './test/Fixture2.purs';

  var stream = purescript.psc({src: fixture});

  stream.on('error', function(e){
    t.ok(/"where"/.test(e.message), 'should have a failure message');
    t.equal(e.name, 'Error');
  });
});

test('psc - invalid option type', function(t){
  t.plan(2);

  try {
    var stream = purescript.psc({src: 10});

    stream.on('error', function(e){
      t.ok(/type mismatch/i.test(error.message), 'should have a failure message');
      t.equal(error.name, 'Error');
    });
  }
  catch (error) {
    t.ok(/type mismatch/i.test(error.message), 'should have a failure message');
    t.equal(error.name, 'Error');
  }
});

test('psc-bundle - basic', function(t){
  t.plan(1);

  var fixture = './test/foreign.js';

  var stream = purescript.pscBundle({src: fixture});

  stream.pipe(through2.obj(function(chunk, encoding, callback){
    t.ok(/psc-bundle/.test(chunk.contents.toString()), 'should have a compiled result');
    callback();
  }));
});

test('psci - basic', function(t){
  t.plan(2);

  var fixture = './test/Fixture1.purs';

  var output = ':m test/Fixture1.purs';

  var stream = purescript.psci({src: fixture});

  stream.pipe(through2.obj(function(chunk, encoding, callback){
    t.equal(chunk.path, '.psci');
    t.equal(chunk.contents.toString(), output);
    callback();
  }));
});

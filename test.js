const { test } = require('uvu');
const { Velocity } = require('./src');
const assert = require('uvu/assert');

test('initialization', () => {
  assert.ok(new Velocity(''));
});

test('static', () => {
  const velocity = new Velocity('');
  assert.ok(velocity);

  assert.instance(velocity, Velocity);
  assert.throws(velocity['#key']);
  assert.throws(velocity['#analyzeMessage']);
});

test.run();

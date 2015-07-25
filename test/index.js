
var test = require('tape')
var constants = require('tradle-constants')
var V = require('../')

test('create, change', function (t) {
  t.plan(10)

  var hashes = [
    'a6c993c0f7faf232891dc75592e8883d03c3b22f',
    '8e27cc5c8bc6fb89366aeadfc0b7831c3aaf1ac2',
    'c50160ada41e206f3466a2bb8d178d564be2698e',
    '904470bbab3c71e25ae700be49422475e56db00f'
  ]

  var data = {
    name: 'Martha',
    age: {
      today: 26,
      yesterday: 55
    }
  }

  var v, w
  var finalV = {
    name: 'Miranda',
    age: 'blue'
  }

  finalV[constants.ROOT_HASH] = hashes[0]
  finalV[constants.PREV_HASH] = hashes[0]

  var finalW = {
    name: 'Jack',
    age: 'blue'
  }

  finalW[constants.ROOT_HASH] = hashes[0]
  finalW[constants.PREV_HASH] = hashes[3]

  initV()
  changeV1()
  changeV2()

  function initV () {
    v = new V(data)
    t.notEqual(v.hasChanged(), true)
    v.currentHash(rethrow(function (hash) {
      t.equal(hash, hashes[0])
    }))

    v.originalHash(rethrow(function (hash) {
      t.equal(hash, hashes[0])
    }))
  }

  function changeV1 () {
    v.set('name', finalV.name)

    t.equal(v.hasChanged(), true)

    v.currentHash(rethrow(function (hash) {
      t.equal(hash, hashes[1])
    }))

    v.originalHash(rethrow(function (hash) {
      t.equal(hash, hashes[0])
    }))
  }

  function changeV2 () {
    v.set('age', finalV.age)

    v.currentHash(rethrow(function (hash) {
      t.equal(hash, hashes[2])
    }))

    v.toJSON(rethrow(function (vJSON) {
      t.deepEqual(vJSON, finalV)
      initW()
    }))
  }

  function initW () {
    w = new V(finalV)
    w.toJSON(rethrow(function (json) {
      t.deepEqual(json, finalV)
    }))

    w.set('name', 'Jack')
    w.toJSON(rethrow(function (wJSON) {
      t.deepEqual(wJSON, finalW)
    }))
  }
})

function rethrow (cb) {
  return function (err, val) {
    if (err) throw err

    cb(val)
  }
}

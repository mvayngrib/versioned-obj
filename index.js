
var extend = require('extend')
var deepEqual = require('deep-equal')
var utils = require('tradle-utils')
var constants = require('tradle-constants')

module.exports = Versioned

function Versioned (props) {
  this._originalProps = extend(true, {}, props)
  this._props = extend(true, {}, props)
}

Versioned.prototype.set = function (k, v) {
  this._props[k] = typeof v === 'object' ? extend(true, {}, v) : v
}

Versioned.prototype.hasChanged = function () {
  return !deepEqual(this._props, this._originalProps)
}

Versioned.prototype.currentHash = function (cb) {
  return getKey(this._props, cb)
}

Versioned.prototype.originalHash = function (cb) {
  return getKey(this._originalProps, cb)
}

Versioned.prototype.toJSON = function (cb) {
  var props = extend(true, {}, this._props)
  if (!this.hasChanged()) {
    return process.nextTick(function () {
      cb(null, props)
    })
  }

  this.originalHash(function (err, prevHash) {
    if (err) return cb(err)

    props[constants.PREV_HASH] = prevHash
    if (!props[constants.ROOT_HASH]) {
      props[constants.ROOT_HASH] = prevHash
    }

    cb(null, props)
  })
}

function toBuffer (json) {
  return new Buffer(utils.stringify(json), 'binary')
}

function getKey (json, cb) {
  utils.getStorageKeyFor(toBuffer(json), function (err, hash) {
    if (err) cb(err)
    else cb(null, hash.toString('hex'))
  })
}

'use strict';

var common = {
  illegalChar: function(str) {
	let pattern=/[`~!@#\$%\^\&\*\(\)_\+<>\?:"\{\},\.\\\/;'\[\]]/img
	return str.replace(pattern, '').length !==  str.trim().length
  },
  maxChar: function(str, length=15) {
    return str.length > length
  },
  isEmail: function(str) {
    return /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(str)
  },
  replaceSpace: function(str) {
  	let pattern=/[\s]/img
  	return str.replace(pattern, '')
  }
}
module.exports = common
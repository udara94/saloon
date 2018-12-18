'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isValueType = exports.isTime = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var allViews = ['hour', 'minute', 'second'];
var allValueTypes = [].concat(allViews);

var hourOptionalSecondsRegExp = /^(([0-1])?[0-9]|2[0-3]):[0-5][0-9](:([0-5][0-9]))?$/;

var isTime = exports.isTime = function isTime(props, propName, componentName) {
  var time = props[propName];


  if (time) {
    if (!hourOptionalSecondsRegExp.test(time)) {
      return new Error('Invalid prop `' + propName + '` of type `' + (typeof minDate === 'undefined' ? 'undefined' : _typeof(minDate)) + '` supplied to `' + componentName + '`, expected time in HH:mm(:ss) format.');
    }
  }

  // Everything is fine
  return null;
};

var isValueType = exports.isValueType = _propTypes2.default.oneOf(allValueTypes);
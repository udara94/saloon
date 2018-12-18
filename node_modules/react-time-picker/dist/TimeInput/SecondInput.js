'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _mergeClassNames = require('merge-class-names');

var _mergeClassNames2 = _interopRequireDefault(_mergeClassNames);

var _dates = require('../shared/dates');

var _propTypes3 = require('../shared/propTypes');

var _utils = require('../shared/utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var select = function select(element) {
  return element && element.select();
};

var SecondInput = function (_PureComponent) {
  _inherits(SecondInput, _PureComponent);

  function SecondInput() {
    _classCallCheck(this, SecondInput);

    return _possibleConstructorReturn(this, (SecondInput.__proto__ || Object.getPrototypeOf(SecondInput)).apply(this, arguments));
  }

  _createClass(SecondInput, [{
    key: 'render',
    value: function render() {
      var maxSecond = this.maxSecond,
          minSecond = this.minSecond;
      var _props = this.props,
          className = _props.className,
          disabled = _props.disabled,
          itemRef = _props.itemRef,
          onChange = _props.onChange,
          onKeyDown = _props.onKeyDown,
          required = _props.required,
          value = _props.value;


      var name = 'second';
      var hasLeadingZero = value !== null && value < 10;

      return [hasLeadingZero && _react2.default.createElement(
        'span',
        { key: 'leadingZero', className: className + '__leadingZero' },
        '0'
      ), _react2.default.createElement('input', {
        key: 'second',
        className: (0, _mergeClassNames2.default)(className + '__input', className + '__second', hasLeadingZero && className + '__input--hasLeadingZero'),
        disabled: disabled,
        name: name,
        max: maxSecond,
        min: minSecond,
        onChange: onChange,
        onFocus: function onFocus(event) {
          return select(event.target);
        },
        onKeyDown: onKeyDown,
        onKeyUp: function onKeyUp(event) {
          return (0, _utils.updateInputWidth)(event.target);
        },
        placeholder: '--',
        ref: function ref(_ref) {
          if (_ref) {
            (0, _utils.updateInputWidth)(_ref);
          }

          if (itemRef) {
            itemRef(_ref, name);
          }
        },
        required: required,
        type: 'number',
        value: value !== null ? value : ''
      })];
    }
  }, {
    key: 'maxSecond',
    get: function get() {
      var _props2 = this.props,
          hour = _props2.hour,
          minute = _props2.minute,
          maxTime = _props2.maxTime;

      return (0, _utils.min)(59, maxTime && hour === (0, _dates.getHours)(maxTime) && minute === (0, _dates.getMinutes)(maxTime) && (0, _dates.getSeconds)(maxTime));
    }
  }, {
    key: 'minSecond',
    get: function get() {
      var _props3 = this.props,
          hour = _props3.hour,
          minute = _props3.minute,
          minTime = _props3.minTime;

      return (0, _utils.max)(0, minTime && hour === (0, _dates.getHours)(minTime) && minute === (0, _dates.getMinutes)(minTime) && (0, _dates.getSeconds)(minTime));
    }
  }]);

  return SecondInput;
}(_react.PureComponent);

exports.default = SecondInput;


SecondInput.propTypes = {
  className: _propTypes2.default.string.isRequired,
  disabled: _propTypes2.default.bool,
  hour: _propTypes2.default.number,
  itemRef: _propTypes2.default.func,
  maxTime: _propTypes3.isTime,
  minute: _propTypes2.default.number,
  minTime: _propTypes3.isTime,
  onChange: _propTypes2.default.func,
  onKeyDown: _propTypes2.default.func,
  required: _propTypes2.default.bool,
  value: _propTypes2.default.number
};
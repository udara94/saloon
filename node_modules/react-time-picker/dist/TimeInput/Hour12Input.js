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

var Hour12Input = function (_PureComponent) {
  _inherits(Hour12Input, _PureComponent);

  function Hour12Input() {
    _classCallCheck(this, Hour12Input);

    return _possibleConstructorReturn(this, (Hour12Input.__proto__ || Object.getPrototypeOf(Hour12Input)).apply(this, arguments));
  }

  _createClass(Hour12Input, [{
    key: 'render',
    value: function render() {
      var maxHour = this.maxHour,
          minHour = this.minHour;
      var _props = this.props,
          className = _props.className,
          disabled = _props.disabled,
          itemRef = _props.itemRef,
          onChange = _props.onChange,
          onKeyDown = _props.onKeyDown,
          required = _props.required,
          value = _props.value;


      var name = 'hour12';
      var value12 = value !== null && (0, _dates.convert24to12)(value)[0];

      return _react2.default.createElement('input', {
        className: (0, _mergeClassNames2.default)(className + '__input', className + '__hour'),
        disabled: disabled,
        name: name,
        max: maxHour,
        min: minHour,
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
        value: value12 !== null ? value12 : ''
      });
    }
  }, {
    key: 'maxHour',
    get: function get() {
      var maxTime = this.props.maxTime;

      return (0, _utils.min)(12, maxTime && (0, _dates.convert24to12)((0, _dates.getHours)(maxTime))[0]);
    }
  }, {
    key: 'minHour',
    get: function get() {
      var minTime = this.props.minTime;

      return (0, _utils.max)(1, minTime && (0, _dates.convert24to12)((0, _dates.getHours)(minTime))[0]);
    }
  }]);

  return Hour12Input;
}(_react.PureComponent);

exports.default = Hour12Input;


Hour12Input.propTypes = {
  className: _propTypes2.default.string.isRequired,
  disabled: _propTypes2.default.bool,
  itemRef: _propTypes2.default.func,
  maxTime: _propTypes3.isTime,
  minTime: _propTypes3.isTime,
  onChange: _propTypes2.default.func,
  onKeyDown: _propTypes2.default.func,
  required: _propTypes2.default.bool,
  value: _propTypes2.default.number
};
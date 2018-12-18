'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.convert24to12 = exports.convert12to24 = exports.getHoursMinutesSeconds = exports.getHoursMinutes = exports.getSeconds = exports.getMinutes = exports.getHours = undefined;

var _dates = require('react-clock/dist/shared/dates');

exports.getHours = _dates.getHours;
exports.getMinutes = _dates.getMinutes;
exports.getSeconds = _dates.getSeconds;
var getHoursMinutes = exports.getHoursMinutes = function getHoursMinutes(date) {
  if (!date) {
    return date;
  }

  var hours = ('0' + (0, _dates.getHours)(date)).slice(-2);
  var minutes = ('0' + (0, _dates.getMinutes)(date)).slice(-2);

  return hours + ':' + minutes;
};

var getHoursMinutesSeconds = exports.getHoursMinutesSeconds = function getHoursMinutesSeconds(date) {
  if (!date) {
    return date;
  }

  var hours = ('0' + (0, _dates.getHours)(date)).slice(-2);
  var minutes = ('0' + (0, _dates.getMinutes)(date)).slice(-2);
  var seconds = ('0' + (0, _dates.getSeconds)(date)).slice(-2);

  return hours + ':' + minutes + ':' + seconds;
};

var convert12to24 = exports.convert12to24 = function convert12to24(hour12, amPm) {
  var hour24 = parseInt(hour12, 10);

  if (amPm === 'am' && hour24 === 12) {
    hour24 = 0;
  } else if (amPm === 'pm' && hour24 < 12) {
    hour24 += 12;
  }

  return hour24;
};

var convert24to12 = exports.convert24to12 = function convert24to12(hour24) {
  var hour12 = hour24 % 12 || 12;

  return [hour12, hour24 < 12 ? 'am' : 'pm'];
};
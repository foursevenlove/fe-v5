import _ from 'lodash';
import moment from 'moment';
import { utilValMap } from '../config';
import * as byteConverter from './byteConverter';

function timeFormatter(val, type: 'seconds' | 'milliseconds', decimals) {
  if (typeof val !== 'number') return val;
  const timeMap = [{
    unit: 'year',
    value: 31104000,
  }, {
    unit: 'month',
    value: 2592000,
  }, {
    unit: 'week',
    value: 604800,
  }, {
    unit: 'day',
    value: 86400,
  }, {
    unit: 'hour',
    value: 3600,
  }, {
    unit: 'min',
    value: 60,
  }]
  const shortTypeMap = {
    seconds: 's',
    milliseconds: 'ms',
  }
  let newVal = val;
  let unit = shortTypeMap[type];
  _.forEach(timeMap, (item) => {
    const _val = val / item.value / (type === 'milliseconds' ? 1000 : 1);
    if (_val >= 1) {
      newVal = _val;
      unit = item.unit;
      return false;
    }
  });
  if (type === 'milliseconds' && unit === 'ms') {
    const _val = newVal / 1000;
    if (_val >= 1) {
      newVal = _val;
      unit = 's';
    }
  }
  return _.round(newVal, decimals) + unit;
}

const valueFormatter = ({util, decimals = 3}, val) => {
  if (util) {
    const utilValObj = utilValMap[util];
    if (utilValObj) {
      const { type, base } = utilValObj;
      return byteConverter.format(val, {
        type,
        base,
        decimals,
      });
    }
    if (util === 'none') {
      return _.round(val, decimals);
    }
    if (util === 'percent') {
      return _.round(val, decimals) + '%';
    }
    if (util === 'percentUnit') {
      return _.round(val * 100, decimals) + '%';
    }
    if (util === 'humantimeSeconds') {
      return moment.duration(val, 'seconds').humanize();
    }
    if (util === 'humantimeMilliseconds') {
      return moment.duration(val, 'milliseconds').humanize();
    }
    if (util === 'seconds') {
      return timeFormatter(val, util, decimals);
    }
    if (util === 'milliseconds') {
      return timeFormatter(val, util, decimals);
    }
    return _.round(val, decimals);
  }
  // 默认返回 SI 不带基础单位
  return byteConverter.format(val, {
    type: 'si',
    decimals,
  });
};
export default valueFormatter;
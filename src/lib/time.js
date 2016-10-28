import Moment from 'moment';

/**
 * formats and returns time in format required by bart API
 * @method getBartTime
 * @param  {[type]}    time [description]
 * @return {[type]}    [description]
 */
export const getBartTime = (time) =>
  time && Moment(time.trim()).format('MM/DD/YYYY h:mm+a').trim();

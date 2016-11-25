/**
 * Functions made available to the entire application
 * @see https://www.hacksparrow.com/global-variables-in-node-js.html
 * @author @noahehall
 * @type {Object}
 */
require('./constants.js');

const appFuncs = {
  scheduleUrl ({ from, to, date, scheduleConfigDepartBool, time }) {
    const
    cmd = scheduleConfigDepartBool ? 'depart' : 'arrive',
    thisDate = `&date=${date || 'now'}`,
    thisTime = time ? `&time=${time}` : '';

    return `http://api.bart.gov/api/sched.aspx?cmd=${cmd}&orig=${from}&dest=${to}${thisDate}${thisTime}&b=4&a=4&l=1&key=${appConsts.apiKey}`;
  },

  stationInfoUrl ({ from }) {
    return `http://api.bart.gov/api/stn.aspx?cmd=stninfo&orig=${from}&key=${appConsts.apiKey}`;
  },

  stationUrl () {
    return `http://api.bart.gov/api/stn.aspx?cmd=stns&key=${appConsts.apiKey}`;
  },

  getBlobType (blob, url) {
    return url.includes('http://fonts.googleapis.com/css') ?
      // http://stackoverflow.com/questions/2871655/proper-mime-type-for-fonts
      'text/css' :
        url.includes('https://travis-ci.org/noahehall/udacity-trainschedule.svg') ?
          'image/svg+xml' :
            blob.type ?
              blob.type :
                'text/html';
  },

  /**
  * available console types, dependent on env
  * @see https://developer.mozilla.org/en-US/docs/Web/API/Console
  * @method consoleTypes
  * @param  {String}     type   type of console request
  * @param  {boolean}     bypass whether to bypass environment check
  * @return {String}     the request console method
  */
  consoleTypes (type, bypass) {
    const prod = {
      debug: 'debug',
      dir: 'dir',
      error: 'error',
      exception: 'exception',
      trace: 'trace',
    };

    const notprod = {
      assert: 'assert',
      clear: 'clear',
      count: 'count',
      dirxml: 'dirxml',
      group: 'group',
      groupCollapsed: 'groupCollapsed',
      groupEnd: 'groupEnd',
      info: 'info',
      log: 'log',
      profile: 'profile',
      profileEnd: 'profileEnd',
      table: 'table',
      time: 'time',
      timeEnd: 'timeEnd',
      timeStamp: 'timeStamp',
      warn: 'warn',
    };

    return bypass || !appConsts.isProd ?
      notprod[type] || prod[type] :
      prod[type];
  },

  /**
  * consoles data dependent on env
  * @see https://developer.mozilla.org/en-US/docs/Web/API/Console
  * @method console
  * @param  {*}    data something to console
  * @param  {String}    [type='log']   console method to use
  * @param  {Boolean}   [bypass=false] should we bypass env check
  * @return {Function} console.method, console.log, or null function
  */
  console (type = 'log', bypass = false) {
    const thisType = this.consoleTypes(type, bypass);

    if (thisType) {
      if (console[thisType]) return console[thisType];
      if (console.log) return console.log; // eslint-disable-line no-console
    }

    return () => null;
  },
}
/**
 * Set global variables on worker & main threads, else node
 * @type {[type]}
 */
const self = self || null;
if (!self) global.appFuncs = appFuncs;
else self.appFuncs = appFuncs;

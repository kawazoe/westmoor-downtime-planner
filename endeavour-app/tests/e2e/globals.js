///////////////////////////////////////////////////////////////////////////////////
// Refer to the entire list of global config settings here:
// https://github.com/nightwatchjs/nightwatch/blob/master/lib/settings/defaults.js#L16
//
// More info on test globals:
//   https://nightwatchjs.org/gettingstarted/configuration/#test-globals
//
///////////////////////////////////////////////////////////////////////////////////

module.exports = {
  // This controls whether to abort the test execution when an assertion failed and skip the rest
  // It's being used in waitFor commands and expect assertions
  'abortOnAssertionFailure': true,

  // This will overwrite the default polling interval (currently 500ms) for waitFor commands
  // And expect assertions that use retry
  'waitForConditionPollInterval': 500,

  // Default timeout value in milliseconds for waitFor commands and implicit waitFor value for
  // Expect assertions
  'waitForConditionTimeout': 5000,

  'default': {
    // The globals defined here are available everywhere in any test env

    MyGlobal() {
      return 'I\'m a method';
    },
  },

  'firefox': {
    // The globals defined here are available only when the chrome testing env is being used
    //    i.e. when running with --env firefox

    MyGlobal() {
      return 'Firefox specific global';
    },
  },

  /////////////////////////////////////////////////////////////////
  // Global hooks
  // - simple functions which are executed as part of the test run
  // - take a callback argument which can be called when an async
  //    Async operation is finished
  /////////////////////////////////////////////////////////////////
  /**
   * Executed before the test run has started, so before a session is created
   */
  /*
  Before(cb) {
    //console.log('global before')
    cb();
  },
  */

  /**
   * Executed before every test suite has started
   */
  /*
  BeforeEach(browser, cb) {
    //console.log('global beforeEach')
    cb();
  },
  */

  /**
   * Executed after every test suite has ended
   */
  /*
  AfterEach(browser, cb) {
    browser.perform(function() {
      //console.log('global afterEach')
      cb();
    });
  },
  */

  /**
   * Executed after the test run has finished
   */
  /*
  After(cb) {
    //console.log('global after')
    cb();
  },
  */

  /////////////////////////////////////////////////////////////////
  // Global reporter
  //  - define your own custom reporter
  /////////////////////////////////////////////////////////////////
  /*
  Reporter(results, cb) {
    cb();
  }
   */
};

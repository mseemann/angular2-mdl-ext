module.exports = function (config) {
  console.log();
  config.set({
    basePath: '../..',
    frameworks: ['jasmine'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-coverage'),
      require('karma-spec-reporter')
    ],
    customLaunchers: {
      // chrome setup for travis CI using chromium
      Chrome_travis_ci: {
        base: 'Chrome',
        flags: ['--no-sandbox']
      }
    },
    files: [
      { pattern: 'dist/vendor/core-js/client/core.js', included: true, watched: false},
      { pattern: 'dist/vendor/systemjs/dist/system-polyfills.js', included: true, watched: false},
      { pattern: 'dist/vendor/systemjs/dist/system.src.js', included: true, watched: false},

      { pattern: 'dist/vendor/zone.js/dist/zone.js', included: true, watched: false},
      { pattern: 'dist/vendor/zone.js/dist/long-stack-trace-zone.js', included: true, watched: false},
      { pattern: 'dist/vendor/zone.js/dist/async-test.js', included: true, watched: false},
      { pattern: 'dist/vendor/zone.js/dist/fake-async-test.js', included: true, watched: false},
      { pattern: 'dist/vendor/zone.js/dist/sync-test.js', included: true, watched: false},
      { pattern: 'dist/vendor/zone.js/dist/proxy.js', included: true, watched: false},
      { pattern: 'dist/vendor/zone.js/dist/jasmine-patch.js', included: true, watched: false},
      { pattern: 'config/tests/karma-test-shim.js', included: true, watched: true },

      { pattern: 'dist/vendor/**/*', included: false, watched: false },

      { pattern: 'dist/@angular2-mdl-ext/**/*', included: false, watched: true }

    ],
    exclude: [
      // Vendor packages might include spec files. We don't want to use those.
      'dist/vendor/**/*.spec.js'
    ],
    preprocessors: {
      'dist/@angular2-mdl-ext/**/!(*spec|*vendor).js': ['coverage']
    },
    coverageReporter: {
      dir : 'coverage/',
      reporters: [
        { type: 'html' },
        { type: 'lcov' },
        { type: 'json',
          subdir: '.',
          file: 'coverage-final.json'
        }
      ]
    },
    reporters: ['spec', 'coverage'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_ERROR,
    autoWatch: true,
    browsers: ['Chrome'],
    singleRun: false
  });
};

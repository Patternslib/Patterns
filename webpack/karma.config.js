// Karma configuration
// Generated on Thu Aug 31 2017 11:03:54 GMT+0200 (CEST)
// See more on https://www.npmjs.com/package/webpack-karma-jasmine
const path = require('path');
var webpackOptions = require('./base.config.js');
webpackOptions['mode'] = 'development';

module.exports = function(config) {
    config.set({
        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: path.join(__dirname, '..'),

        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ['jasmine'],


        // list of files / patterns to load in the browser
        files: [
            'tests/specs/*/*.js',
            'src/pat/*/tests.js',
            {
                pattern: 'src/pat/date-picker/i18n.json',
                served: true,
                included: false
            },
            {
                pattern: 'src/pat/date-picker/date-picker.css',
                served: true,
                included: false
            }
        ],
        proxies: {
            '/src/pat/date-picker': '/base/src/pat/date-picker'
        },


        // list of files to exclude
        exclude: [],

        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {
            //use webpack to support require() in test-suits .js files
            //use babel-loader from webpack to compile es2015 features in .js files
            //add webpack as preprocessor
            'tests/specs/*/*.js': ['webpack', 'sourcemap' /*, 'coverage'*/ ],
            'src/pat/*/tests.js': ['webpack', 'sourcemap' /*, 'coverage'*/ ],
            // list here the files that you want transpiled by babel
            'src/pat/masonry/tests.js': ['webpack', 'sourcemap', 'babel' /*, 'coverage'*/ ],
            'src/pat/calendar/tests.js': ['webpack', 'sourcemap', 'babel' /*, 'coverage'*/ ],
        },
        babelPreprocessor: {
            options: {
                plugins: ['syntax-dynamic-import'],
                presets: [["@babel/env", {
                      "targets": {
                        "browsers": ["last 2 versions", "ie >= 11"]
                      }
                    }]],
                sourceMap: 'inline'
            },
            filename: function(file) {
                return file.originalPath.replace(/\.js$/, '.es5.js');
            },
            sourceFileName: function(file) {
                return file.originalPath;
            }
        },
        webpack: webpackOptions,

        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: ['mocha', 'kjhtml' /*, 'coverage','dots','progress','spec'*/ ],

        coverageReporter: {
            type: 'html',
            dir: 'coverage/'
        },
        //address that the server will listen on, '0.0.0.0' is default
        listenAddress: '0.0.0.0',
        //hostname to be used when capturing browsers, 'localhost' is default
        hostname: 'localhost',
        //the port where the web server will be listening, 9876 is default
        port: 9876,

        //when a browser crashes, karma will try to relaunch, 2 is default
        retryLimit: 0,

        //how long does Karma wait for a browser to reconnect, 2000 is default
        browserDisconnectTimeout: 5000,

        //how long will Karma wait for a message from a browser before disconnecting from it, 10000 is default
        browserNoActivityTimeout: 10000,

        //timeout for capturing a browser, 60000 is default
        captureTimeout: 60000,

        // enable / disable colors in the output (reporters and logs)
        colors: true,


        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,


        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,


        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers: ['MyCustomLauncher' /*,'PhantomJS','Firefox','Edge','ChromeCanary','Opera','IE','Safari'*/ ],


        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: false,

        //if true, Karma fails on running empty test-suites
        failOnEmptyTestSuite: false,

        // Concurrency level
        // how many browser should be started simultaneous
        concurrency: Infinity,


        /*karma-webpack config*/
        webpackMiddleware: {
            //turn off webpack bash output when run the tests
            noInfo: false, //true for later
            stats: 'errors-only'
        },

        /*karma-mocha-reporter config*/
        mochaReporter: {
            output: 'full' //full, autowatch, minimal
        },

        customLaunchers: {
            'MyCustomLauncher': {
                base: 'ChromeHeadless',
                debug: true,
                options: {
                    viewportSize: {
                      width: 1280,
                      height: 1024
                    }
                }
            }
        }
    })
}

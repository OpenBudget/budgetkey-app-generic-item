module.exports = function(config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine'],

    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-webpack'),
      require('karma-sourcemap-loader')
    ],

    client: {
      clearContext: false // leave Jasmine Spec Runner output visible in browser
    },

    customLaunchers: {
      // From the CLI. Not used here but interesting
      // chrome setup for travis CI using chromium
      Chrome_travis_ci: {
        base: 'Chrome',
        flags: ['--no-sandbox']
      }
    },

    files: [
      {pattern: 'dist/**/*', included: false, watched: false, served: true},
      {pattern: 'app/**/*.spec.ts', included: true, watched: true}
    ],

    exclude: [],
    preprocessors: {
      '**/*.ts': ['webpack', 'sourcemap']
    },
    webpack: require('./webpack.config.test'),
    webpackMiddleware: {
      mimeTypes: {
        'text/javascript': ['ts']
      }
    },
    reporters: ['progress', 'kjhtml'],

    proxies: {
      '/assets/': 'http://localhost:9876/base/dist/assets/'
    },

    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['Chrome'],
    singleRun: false
  })
};

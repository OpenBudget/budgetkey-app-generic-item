/* global jasmine, __karma__, window, Error */

declare let window: any;

if (!window.__$zone$Loaded) {
  require('core-js'); // ES6 + reflect-metadata
  require('zone.js/dist/zone');
  require('zone.js/dist/proxy');
  require('zone.js/dist/sync-test');
  require('zone.js/dist/async-test');
  require('zone.js/dist/jasmine-patch');
  window.__$zone$Loaded = true;
}

import { TestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting
} from '@angular/platform-browser-dynamic/testing';

Error.stackTraceLimit = 0; // "No stacktrace"" is usually best for app testing.

// Uncomment to get full stacktrace output. Sometimes helpful, usually not.
// Error.stackTraceLimit = Infinity; //

jasmine.DEFAULT_TIMEOUT_INTERVAL = 5000;

TestBed.initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting()
);

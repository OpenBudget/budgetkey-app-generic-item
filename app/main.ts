import 'core-js/client/shim.min.js';
import 'reflect-metadata';
import 'zone.js';

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
// import { TRANSLATIONS, TRANSLATIONS_FORMAT } from '@angular/core';

import { AppModule } from './app.module';

platformBrowserDynamic().bootstrapModule(AppModule);

// const translations = {
//   'he': require(`./i18n/messages.he.xlf`),
//   'en': require(`./i18n/messages.en.xlf`),
// }[LANG];

// let providers: any[] = [];
// if (typeof(translations) !== 'undefined') {
//   providers = [
//     {provide: TRANSLATIONS, useValue: translations},
//     {provide: TRANSLATIONS_FORMAT, useValue: 'xlf'},
//   ];
// }

// platformBrowserDynamic().bootstrapModule(AppModule, {
//   providers: providers
// });

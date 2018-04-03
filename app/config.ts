import { InjectionToken } from '@angular/core';

export const THEME_TOKEN = new InjectionToken('Theme Config');

export const defaultTheme = {
  siteName: 'מפתח התקציב',
  searchPlaceholder: 'חפשו הכל.. סעיף תקציבי, ארגון, אדם, או כל דבר אחר העולה על דעתכם..'
};

## Budget Key Generic Item Page

This is a generic item page for the Budget Key project.

To read on how it's used, please take a look [here](https://github.com/OpenBudget/BudgetKey/blob/master/documentation/FrontEndDevelopment.md).

## Quick Start (Set up a dev server)
1. Clone && cd into directory
2. `npm install`
3. `npm run dist-serve`
4. example app url which should be available: http://localhost:8000/org/association/580050789

You should make sure you use the correct node version, at time of writing it's v8.3.0. If you have [nvm](https://github.com/creationix/nvm/blob/master/README.md#installation) installed, 
you can just run `nvm install` and you will have the correct version.

## Themes

The core components and apps support themes for reusability of common code.

To run the app with a different theme, you need to set the theme in theme.THEME_NAME.json

For example, theme.govbuy.json:

```json
{
  "BUDGETKEY_NG2_COMPONENTS_THEME": {
    "siteName": "רכש פתוח"
  },
  "BUDGETKEY_APP_GENERIC_ITEM_THEME": {
    "siteName": "רכש פתוח",
    "searchPlaceholder": "חפשו רכש!"
  }
}
```

To enable a theme, add it to the URL, e.g. http://localhost:8000/org/association/580050789?theme=govbuy

The theme files could be overwritten by docker volume - to allow to use the same image to serve the app using different themes.

For example, given a modified theme in ./my-theme.json:

```
docker build -t budgetkey-app-generic-item .
docker run -it -v `pwd`/my-theme.json:/app/theme.my.json --rm --name budgetkey-app-generic-item -p8000:8000 budgetkey-app-generic-item
```

You could then add ?theme=my to enable this theme

--- 

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 7.1.3.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

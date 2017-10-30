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

To run the app with a different theme, you need to set the theme in assets/theme.js, for example:

```
BUDGETKEY_NG2_COMPONENTS_THEME = {
  siteName: "רכש פתוח"
};
```

Restart the server and it should use this modified theme.

The assets/theme.js file could be overwritten by docker volume - to allow to use the same image to serve the app using different themes.

For example, given a modified theme in ./my-theme.js:

```
docker build -t budgetkey-app-generic-item .
docker run -it -v `pwd`/my-theme.js:/app/dist/assets/theme.js --rm --name budgetkey-app-generic-item -p8000:8000 budgetkey-app-generic-item
```

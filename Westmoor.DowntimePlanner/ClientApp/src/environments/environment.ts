// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  oidc: {
    authority: 'dev-kawazoe.us.auth0.com',
    client_id: 'VxaXJsnUSCHHjKVwN7jFemYVXkKP3F59',
    redirect_url: '/oidc-callback',
    audience: 'westmoor-downtime-planner.azurewebsites.net'
  },
  analytics: {
    instrumentationKey: '7576ae61-9671-4bdc-ad0f-8069f5c3bc11',
    globalCustomProperties: {
      ENV: 'local'
    }
  }
};

/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.

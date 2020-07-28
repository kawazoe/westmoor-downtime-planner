export const environment = {
  production: true,
  oidc: {
    authority: 'westmoor-downtime-planner.us.auth0.com',
    client_id: 'aMB5yx4ZiM4tHwGaemoieGQObkUNNe4z',
    redirect_url: '/oidc-callback',
    audience: 'westmoor-downtime-planner.azurewebsites.net'
  },
  analytics: {
    instrumentationKey: '7576ae61-9671-4bdc-ad0f-8069f5c3bc11',
    globalCustomProperties: {
      ENV: 'production'
    }
  }
};

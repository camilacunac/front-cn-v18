export const environment = {
  production: true,
  msalConfig: {
    auth: {
      clientId: '96772803-aff7-4ed9-b362-930f75ee4858',
      authority:
        'https://login.microsoftonline.com/5497f70a-565c-40b7-92c7-b62049f8638f',
    },
  },
  apiConfig: {
    scopes: ['user.read'],
    uri: 'https://graph.microsoft-ppe.com/v1.0/me',
  },
};

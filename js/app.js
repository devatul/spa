var React     = require('react');
var router    = require('./router').getRouter();
window.React  = React;
var Auth      = require('j-toker');

Auth.configure({
  apiUrl:                'http://api.pricing.nubity.com',
  signOutPath:           '/auth/sign_out',
  emailSignInPath:       '/auth/sign_in',
  emailRegistrationPath: '/auth',
  accountUpdatePath:     '/auth',
  accountDeletePath:     '/auth',
  passwordResetPath:     '/auth/password',
  passwordUpdatePath:    '/auth/password',
  tokenValidationPath:   '/auth/validate_token',
  proxyIf:               function () { return false; },
  proxyUrl:              '/proxy',
  validateOnPageLoad:    false,
  forceHardRedirect:     false,
  storage:               'localStorage',
  cookieExpiry:          14,
  cookiePath:            '/',

  passwordResetSuccessUrl: function () {
    return window.location.href;
  },

  confirmationSuccessUrl:  function () {
    return window.location.href;
  },

  tokenFormat: {
    'Authorization': '{{ nubity-token }}',
    'token-type':   'Bearer',
  },

  parseExpiry: function (headers) {
    return (parseInt(headers['expiry'], 10) * 1000) || null;
  },

  handleLoginResponse: function (resp) {
    return resp.data;
  },

  handleAccountUpdateResponse: function (resp) {
    return resp.data;
  },

  handleTokenValidationResponse: function (resp) {
    return resp.data;
  },

  authProviderPaths: {
    github:    '/auth/github',
    facebook:  '/auth/facebook',
    google:    '/auth/google_oauth2',
  },
});

router.run(function (Handler, state) {
  React.render(
    <Handler />,
    document.getElementById('nubityApp')
  );
});

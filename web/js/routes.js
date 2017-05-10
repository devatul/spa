var React                    = require('react');
var reactRouter              = require('react-router');
var Router                   = reactRouter.Router;
var hashHistory              = reactRouter.hashHistory;
var IndexRoute               = reactRouter.IndexRoute;
var ReactDOM                 = require('react-dom');
var Route                    = reactRouter.Route;
var NubityApp                = require('./components/NubityApp.react');
var Login                    = require('./components/Login.react');
var NotFound                 = require('./components/Not_found.react');
var ForgotPassword           = require('./components/Forgot_password.react');
var ChangePassword           = require('./components/Change_password.react');
var ResetPassword            = require('./components/Reset_password.react');
var Signup                   = require('./components/Signup.react');
var OnBoarding               = require('./components/Onboarding_section.react');
var Infrastructure           = require('./components/Infrastructure_section.react');
var Dashboard                = require('./components/Dashboard_section.react');
var Alerts                   = require('./components/Alerts_section.react');
var Performance              = require('./components/Performance_section.react');
var Ninja                    = require('./components/Ninja_support_section.react');
var CreateTicket             = require('./components/Create_ticket.react');
var LiveChat                 = require('./components/Live_chat.react');
var TermsAndConditions       = require('./components/Terms_and_conditions.react');
var PrivacyPolicies          = require('./components/Privacy_policies.react');
var ViewTicket               = require('./components/View_ticket.react');
var VerifyAccount            = require('./components/Verify_account.react');
var ConfirmAccount           = require('./components/Confirm_account.react');
var InfrastructureMonitoring = require('./components/Infrastructure_monitoring.react');
var InfrastructureConfigure  = require('./components/Infrastructure_configure_monitoring.react');

var routes = (
  <Router history={hashHistory}>
    <Route component={NubityApp} path='/'>
      <Route name="login" path='/login' component={Login} />
      <Route name="verify-account" path='/verify-account' component={VerifyAccount} />
      <Route name="forgot_password" path='/forgot-password' component={ForgotPassword} />
      <Route name="change_password" path='/change-password/:token' component={ChangePassword} />
      <Route name="signup" path='/signup' component={Signup} />
      <Route name="confirm_account" path='/confirm-account/:token' component={ConfirmAccount} />
      <Route name="onboarding" path='/onboarding' component={OnBoarding} />
      <Route name="configure" path='/infrastructure/:id/monitoring/configure' component={InfrastructureConfigure} />
      <Route name="monitoring" path='/infrastructure/:id/monitoring' component={InfrastructureMonitoring} />
      <Route name="infrastructure" path='/infrastructure' component={Infrastructure} />
      <Route name="alerts" path='/alerts' component={Alerts} />
      <Route name="performance" path='/performance' component={Performance} />
      <Route name="ninja" path='/support' component={Ninja} />
      <Route name="view_ticket_params" path='/support/:id' component={ViewTicket} />
      <Route name="create_ticket" path='/support/create-ticket' component={CreateTicket} />
      <Route name="live_chat" path='/live-chat' component={LiveChat} />
      <route name="terms_and_conditions" path='/terms-and-conditions' component={TermsAndConditions} />
      <route name="privacy_policies" path='/privacy-policies' component={PrivacyPolicies} />
      <Route name="reset_password" path='/reset-password/:token' component={ResetPassword} />
      <Route name="not-found" path='*' component={NotFound} />
      <IndexRoute component={Dashboard} />
    </Route>
  </Router>
);

module.exports = routes;

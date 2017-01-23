var React                   = require ('react');
var Router                  = require ('react-router');
var Route                   = Router.Route;
var DefaultRoute            = Router.DefaultRoute;
var NubityApp               = require ('./components/NubityApp.react');
var Login                   = require ('./components/Login.react');
var ForgotPassword          = require ('./components/Forgot_password.react');
var ChangePassword          = require ('./components/Change_password.react');
var ResetPassword           = require ('./components/Reset_password.react');
var Signup                  = require ('./components/Signup.react');
var OnBoarding              = require ('./components/Onboarding_section.react');
var Infrastructure          = require ('./components/Infrastructure_section.react');
var Dashboard               = require ('./components/Dashboard_section.react');
var Alerts                  = require ('./components/Alerts_section.react');
var Performance             = require ('./components/Performance_section.react');
var Ninja                   = require ('./components/Ninja_support_section.react');
var CreateTicket            = require ('./components/Create_ticket.react');
var LiveChat                = require ('./components/Live_chat.react');
var TermsAndConditions      = require ('./components/Terms_and_conditions.react');
var PrivacyPolicies         = require ('./components/Privacy_policies.react');
var ViewTicket              = require ('./components/View_ticket.react');
var ConfirmAccount          = require ('./components/Confirm_account.react');
var Home                    = require ('./components/Dashboard_section.react');

var routes = (
  <Route handler={NubityApp}           path='/'>
    <Route name="login"                path='/login'                   handler={Login} />
    <Route name="forgot_password"      path='/forgot-password'         handler={ForgotPassword} />
    <Route name="change_password"      path='/change-password/:token'  handler={ChangePassword} />
    <Route name="signup"               path='/signup'                  handler={Signup} />
    <Route name="confirm_account"      path='/confirm-account/:token'  handler={ConfirmAccount} />
    <Route name="onboarding"           path='/onboarding'              handler={OnBoarding} />
    <Route name="infrastructure"       path='/infrastructure'          handler={Infrastructure} />
    <Route name="dashboard"            path='/dashboard'               handler={Dashboard} />
    <Route name="alerts"               path='/alerts'                  handler={Alerts} />
    <Route name="performance"          path='/performance'             handler={Performance} />
    <Route name="ninja"                path='/ninja-support'           handler={Ninja} />
    <Route name="create_ticket"        path='/create-ticket'           handler={CreateTicket} />
    <Route name="live_chat"            path='/live-chat'               handler={LiveChat} />
    <route name="terms_and_conditions" path='/terms-and-conditions'    handler={TermsAndConditions} />
    <route name="privacy_policies"     path='/privacy-policies'        handler={PrivacyPolicies} />
    <Route name="view_ticket"          path='/view-ticket/'            handler={ViewTicket} />
    <Route name="view_ticket_params"   path='/view-ticket/:id'         handler={ViewTicket} />
    <Route name="reset_password"       path='/reset-password/:token'   handler={ResetPassword} />
    <Route name="home"                 path='/'                        handler={Home} /> 
    <DefaultRoute                                                      handler={Login}/>
  </Route>
);
module.exports = routes;

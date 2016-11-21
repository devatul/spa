var React                   = require ('react');
var Router                  = require ('react-router');
var Route                   = Router.Route;
var DefaultRoute            = Router.DefaultRoute;
var NubityApp               = require ('./components/NubityApp.react');
var Login                   = require ('./components/Login.react');
var ForgotPassword          = require ('./components/Forgot_password.react');
var ChangePassword          = require ('./components/Change_password.react');
var Signup                  = require ('./components/Signup.react');
var Infrastructure          = require ('./components/Infrastructure_section.react');
var Dashboard               = require ('./components/Dashboard_section.react');
var Alerts                  = require ('./components/Alerts_section.react');
var Performance             = require ('./components/Performance_section.react');
var Ninja                   = require ('./components/Ninja_support_section.react');
var CreateTicket            = require ('./components/Create_ticket.react');
var LiveChat                = require ('./components/Live_chat.react');

var routes = (
  <Route handler={NubityApp}           path="/">
    <Route name="login"                path='/login'                   handler={Login} />
    <Route name="forgot_password"      path='/forgot_password'         handler={ForgotPassword} />
    <Route name="change_password"      path='/change_password/:token'  handler={ChangePassword} />
    <Route name="signup"               path='/signup'                  handler={Signup} />
    <Route name="infrastructure"       path='/infrastructure'          handler={Infrastructure} />
    <Route name="dashboard"            path='/dashboard'               handler={Dashboard} />
    <Route name="alerts"               path='/alerts'                  handler={Alerts} />
    <Route name="performance"          path='/performance'             handler={Performance} />
    <Route name="ninja"                path='/ninja_support'           handler={Ninja} />
    <Route name="create_ticket"        path='/create_ticket'           handler={CreateTicket} />
    <Route name="live_chat"            path='/live_chat'               handler={LiveChat} />
    <DefaultRoute                                                      handler={Dashboard}/>
  </Route>
);
module.exports = routes;

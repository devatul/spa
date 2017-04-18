var React                      = require('react');
var Router                     = require('../router');
var redirect                   = require('../actions/RouteActions').redirect;
var SessionStore               = require('../stores/SessionStore');

module.exports = React.createClass({

  render: function () {
    return (
      <div>
        <div>
          <div className="section-title">
            <h2>My Team</h2>
          </div>
          <div className="row">
            <div className="col-xs-1">
              <img src="https://upload.wikimedia.org/wikipedia/en/7/70/Shawn_Tok_Profile.jpg" height="45" width="45" alt="..." className="img-circle" />
            </div>
            <div className="col-xs-1">
              <img src="https://upload.wikimedia.org/wikipedia/en/7/70/Shawn_Tok_Profile.jpg" height="45" width="45" alt="..." className="img-circle" />
            </div>
            <div className="col-xs-1">
              <img src="https://upload.wikimedia.org/wikipedia/en/7/70/Shawn_Tok_Profile.jpg" height="45" width="45" alt="..." className="img-circle" />
            </div>
            <div className="col-xs-1">
              <img src="https://upload.wikimedia.org/wikipedia/en/7/70/Shawn_Tok_Profile.jpg" height="45" width="45" alt="..." className="img-circle" />
            </div>
            <div className="col-xs-1">
              <button className="btn-plus-circle">+</button>
            </div>
          </div>
          <hr />
          <form >
            <div className="public-cloud-form col-lg-offset-1 col-lg-4">
              <div className="form-group">
                <div className="input-group">
                  <div className="input-group-addon">
                    <i className="input-icon fa fa-user" aria-hidden="true"></i>
                  </div>
                  <input type="text" className="form-control no-shadow" id="privateUser" placeholder="First Name" />
                </div>
              </div>
              <div className="form-group">
                <div className="input-group">
                  <div className="input-group-addon">
                    <i className="input-icon fa fa-user" aria-hidden="true"></i>
                  </div>
                  <input type="text" className="form-control no-shadow" id="privatePassword" placeholder="Last Name" />
                </div>
              </div>
              <div className="form-group">
                <div className="input-group">
                  <div className="input-group-addon">
                    <i className="input-icon fa fa-server" aria-hidden="true"></i>
                  </div>
                  <input type="text" className="form-control no-shadow" id="integrationName" placeholder="Email" />
                </div>
              </div>
              <div className="form-group">
                <div className="input-group">
                  <div className="input-group-addon">
                    <i className="input-icon fa fa-lock" aria-hidden="true"></i>
                  </div>
                  <input type="text" className="form-control no-shadow" id="privateNubityName" placeholder="Password" />
                </div>
              </div>
            </div>
            <div className="public-cloud-form col-lg-offset-1 col-lg-4">
              <div className="form-group">
                <div className="input-group">
                  <div className="input-group-addon">
                    <i className="input-icon fa fa-skype" aria-hidden="true"></i>
                  </div>
                  <input type="text" className="form-control no-shadow" id="skype" placeholder="Skype" />
                </div>
              </div>
              <div className="form-group">
                <div className="input-group">
                  <div className="input-group-addon">
                    <i className="input-icon fa fa-language" aria-hidden="true"></i>
                  </div>
                  <select className="form-control no-shadow" id="language">
                    <option>Select Language</option>
                    <option>1</option>
                    <option>2</option>
                    <option>3</option>
                    <option>4</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <div className="input-group">
                  <div className="input-group-addon">
                    <i className="input-icon fa fa-clock-o" aria-hidden="true"></i>
                  </div>
                  <input type="text" className="form-control no-shadow" id="timeZone" placeholder="Time Zone" />
                </div>
              </div>
              <div className="form-group">
                <div className="input-group">
                  <div className="input-group-addon">
                    <i className="input-icon fa fa-user" aria-hidden="true"></i>
                  </div>
                  <input type="text" className="form-control no-shadow" id="contactType" placeholder="Contact Type" />
                </div>
              </div>
            </div>
            <div className="col-sm-12 light-grey-background">
              <h3><i className="input-icon fa fa-bell" aria-hidden="true"></i><span className="padding-left">Alerts Notification</span></h3>
            </div>
            <div className="col-sm-12 light-grey-background">
              <div className="form-group col-sm-4">
                <div className="input-group">
                  <div className="input-group-addon">
                    <div className="checkbox account-checkbox"><input type="checkbox" value="" /></div>
                  </div>
                  <div className="form-control no-shadow" id="information">Information</div>
                </div>
              </div>
              <div className="form-group col-sm-4">
                <div className="input-group">
                  <div className="input-group-addon">
                    <div className="checkbox account-checkbox"><input type="checkbox" value="" /></div>
                  </div>
                  <div className="form-control no-shadow" id="warning">Warning</div>
                </div>
              </div>
              <div className="form-group col-sm-4">
                <div className="input-group">
                  <div className="input-group-addon">
                    <div className="checkbox account-checkbox"><input type="checkbox" value="" /></div>
                  </div>
                  <div className="form-control no-shadow" id="critical">Critical</div>
                </div>
              </div>
            </div>
            <div className="col-sm-12">
              <button type="button" className="btn btn-success pull-right public-cloud-button">Save</button>
            </div>
          </form>
        </div>
      </div>
    );
  },
});

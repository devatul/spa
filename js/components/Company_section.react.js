var React                      = require('react');
var Router                     = require('../router');
var redirect                   = require('../actions/RouteActions').redirect;
var SessionStore               = require('../stores/SessionStore');

module.exports = React.createClass({

  render: function() {
    return (
      <div>
        <div>
          <div className="section-title">
            <h2>Company</h2>
          </div>
          <hr/>
          <form >
            <div className="public-cloud-form col-sm-12">
              <div className="form-group">
                <div className="input-group">
                  <div className="input-group-addon">
                    <i className="input-icon fa fa-suitcase" aria-hidden="true"></i>
                  </div>
                  <input type="text" className="form-control no-shadow" id="companyName" placeholder="Company Name"/>
                </div>
              </div>
              <div className="form-group">
                <div className="input-group">
                  <div className="input-group-addon">
                    <i className="input-icon fa fa-area-chart" aria-hidden="true"></i>
                  </div>
                  <input type="text" className="form-control no-shadow" id="nameComercial" placeholder="Name Comercial"/>
                </div>
              </div>
              <div className="form-group">
                <div className="input-group">
                  <div className="input-group-addon">
                    <i className="input-icon fa fa-suitcase" aria-hidden="true"></i>
                  </div>
                  <input type="text" className="form-control no-shadow" id="rfc" placeholder="RFC"/>
                </div>
              </div>
            </div>
            <div className="public-cloud-form col-sm-offset-1 col-sm-4">
              <div className="form-group">
                <div className="input-group">
                  <div className="input-group-addon">
                    <i className="input-icon fa fa-flag" aria-hidden="true"></i>
                  </div>
                  <input type="text" className="form-control no-shadow" id="country" placeholder="Country"/>
                </div>
              </div>
              <div className="form-group">
                <div className="input-group">
                  <div className="input-group-addon">
                    <i className="input-icon fa fa-flag" aria-hidden="true"></i>
                  </div>
                  <input type="text" className="form-control no-shadow" id="state" placeholder="State"/>
                </div>
              </div>
              <div className="form-group">
                <div className="input-group">
                  <div className="input-group-addon">
                    <i className="input-icon fa fa-flag" aria-hidden="true"></i>
                  </div>
                  <input type="text" className="form-control no-shadow" id="city" placeholder="City"/>
                </div>
              </div>
            </div>
            <div className="public-cloud-form col-sm-offset-1 col-sm-4">
              <div className="form-group">
                <div className="input-group">
                  <div className="input-group-addon">
                    <i className="input-icon fa fa-map-marker" aria-hidden="true"></i>
                  </div>
                  <input type="text" className="form-control no-shadow" id="skype" placeholder="Address"/>
                </div>
              </div>
              <div className="form-group">
                <div className="input-group">
                  <div className="input-group-addon">
                    <i className="input-icon fa fa-map-marker" aria-hidden="true"></i>
                  </div>
                  <select className="form-control no-shadow" id="language">
                    <option></option>
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
                    <i className="input-icon fa fa-envelope" aria-hidden="true"></i>
                  </div>
                  <input type="text" className="form-control no-shadow" id="timeZone" placeholder="Postal Code"/>
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
  }
});

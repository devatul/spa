var React                      = require('react');
var Router                     = require('../router');
var redirect                   = require('../actions/RouteActions').redirect;
var SessionStore               = require('../stores/SessionStore');
var getCompanyInfo             = require('../actions/RequestActions').getCompanyInfo;
var getUserData                = require('../actions/StorageActions').getUserData;
var company                    = getUserData('company');

module.exports = React.createClass({
  getInitialState: function () {
    var companyInfo = SessionStore.getCompanyInfo();
    return {
      companyInfo: companyInfo,
    };
  },

  componentDidMount: function () {
    getCompanyInfo();
    SessionStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function () {
    SessionStore.removeChangeListener(this._onChange);
  },

  _onChange: function () {
    if (this.isMounted()) {
      var companyInfo = SessionStore.getCompanyInfo();
      this.setState({
        companyInfo: companyInfo,
      });
    }
  },

  render: function () {
    var companyInfo = this.state.companyInfo;
    var name = companyInfo.name;
    var tradeName = companyInfo.trade_name;
    var address = companyInfo.address;
    var country = companyInfo.country;
    var state = companyInfo.state;
    var city = companyInfo.city;
    var language = companyInfo.locale;

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
                  <input type="text" className="form-control no-shadow" id="companyName" placeholder="Company Name" value={name} readOnly/>
                </div>
              </div>
              <div className="form-group">
                <div className="input-group">
                  <div className="input-group-addon">
                    <i className="input-icon fa fa-area-chart" aria-hidden="true"></i>
                  </div>
                  <input type="text" className="form-control no-shadow" id="nameComercial" placeholder="Name Comercial" value={tradeName} readOnly/>
                </div>
              </div>
              <div className="form-group">
                <div className="input-group">
                  <div className="input-group-addon">
                    <i className="input-icon fa fa-suitcase" aria-hidden="true"></i>
                  </div>
                  <input type="text" className="form-control no-shadow" id="rfc" placeholder="RFC" readOnly/>
                </div>
              </div>
            </div>
            <div className="public-cloud-form col-sm-offset-1 col-sm-4">
              <div className="form-group">
                <div className="input-group">
                  <div className="input-group-addon">
                    <i className="input-icon fa fa-flag" aria-hidden="true"></i>
                  </div>
                  <input type="text" className="form-control no-shadow" id="country" placeholder="Country" value={country} readOnly/>
                </div>
              </div>
              <div className="form-group">
                <div className="input-group">
                  <div className="input-group-addon">
                    <i className="input-icon fa fa-flag" aria-hidden="true"></i>
                  </div>
                  <input type="text" className="form-control no-shadow" id="state" placeholder="State" value={state} readOnly/>
                </div>
              </div>
              <div className="form-group">
                <div className="input-group">
                  <div className="input-group-addon">
                    <i className="input-icon fa fa-flag" aria-hidden="true"></i>
                  </div>
                  <input type="text" className="form-control no-shadow" id="city" placeholder="City" value={city} readOnly/>
                </div>
              </div>
            </div>
            <div className="public-cloud-form col-sm-offset-1 col-sm-4">
              <div className="form-group">
                <div className="input-group">
                  <div className="input-group-addon">
                    <i className="input-icon fa fa-map-marker" aria-hidden="true"></i>
                  </div>
                  <input type="text" className="form-control no-shadow" id="skype" placeholder="Address" value={address} readOnly/>
                </div>
              </div>
              <div className="form-group">
                <div className="input-group">
                  <div className="input-group-addon">
                    <i className="input-icon fa fa-map-marker" aria-hidden="true"></i>
                  </div>
                  <select className="form-control no-shadow" id="language" readOnly>
                    <option>{language}</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <div className="input-group">
                  <div className="input-group-addon">
                    <i className="input-icon fa fa-envelope" aria-hidden="true"></i>
                  </div>
                  <input type="text" className="form-control no-shadow" id="timeZone" placeholder="Postal Code" readOnly/>
                </div>
              </div>
            </div>
            <div className="col-sm-12">
              <button type="button" className="btn btn-success pull-right public-cloud-button disabled">Save</button>
            </div>
          </form>
        </div>
      </div>
    );
  },
});

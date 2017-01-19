var React                      = require('react');
var Router                     = require('../router');
var redirect                   = require('../actions/RouteActions').redirect;
var SessionStore               = require('../stores/SessionStore');
var getCompanyInfo             = require('../actions/RequestActions').getCompanyInfo;
var company                    = localStorage.getItem('nubity-company');

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
    SessionStore.addChangeListener(this._onChange);
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
    var postalCode = '';

    if (null !== companyInfo.postal_code) {
      postalCode = companyInfo.postal_code;
    }

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
                  <input type="text" className="form-control no-shadow" id="companyName" placeholder="Company Name" value={name}/>
                </div>
              </div>
              <div className="form-group">
                <div className="input-group">
                  <div className="input-group-addon">
                    <i className="input-icon fa fa-area-chart" aria-hidden="true"></i>
                  </div>
                  <input type="text" className="form-control no-shadow" id="nameComercial" placeholder="Name Comercial" value={tradeName}/>
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
                  <input type="text" className="form-control no-shadow" id="country" placeholder="Country" value={country}/>
                </div>
              </div>
              <div className="form-group">
                <div className="input-group">
                  <div className="input-group-addon">
                    <i className="input-icon fa fa-flag" aria-hidden="true"></i>
                  </div>
                  <input type="text" className="form-control no-shadow" id="state" placeholder="State" value={state}/>
                </div>
              </div>
              <div className="form-group">
                <div className="input-group">
                  <div className="input-group-addon">
                    <i className="input-icon fa fa-flag" aria-hidden="true"></i>
                  </div>
                  <input type="text" className="form-control no-shadow" id="city" placeholder="City" value={city}/>
                </div>
              </div>
            </div>
            <div className="public-cloud-form col-sm-offset-1 col-sm-4">
              <div className="form-group">
                <div className="input-group">
                  <div className="input-group-addon">
                    <i className="input-icon fa fa-map-marker" aria-hidden="true"></i>
                  </div>
                  <input type="text" className="form-control no-shadow" id="skype" placeholder="Address" value={address}/>
                </div>
              </div>
              <div className="form-group">
                <div className="input-group">
                  <div className="input-group-addon">
                    <i className="input-icon fa fa-map-marker" aria-hidden="true"></i>
                  </div>
                  <select className="form-control no-shadow" id="language">
                    <option>{language}</option>
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
  },
});

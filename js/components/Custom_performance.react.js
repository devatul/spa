var React                      = require('react');
var Router                     = require('../router');
var redirect                   = require('../actions/RouteActions').redirect;
var SessionStore               = require('../stores/SessionStore');

module.exports = React.createClass({

  render: function() {
    return (
      <div className="">
        <ul className="nav nav-tabs section-tabs">
          <li role="presentation">
            <a className="grey-color" href="#">MySQL Server 1</a>
          </li>
          <li role="presentation">
            <a className="grey-color" href="#">MySQL Server 2</a>
          </li>
          <li role="presentation" >
            <a className="grey-color" href="#">MySQL Server 3</a>
          </li>
          <li role="presentation">
            <a className="grey-color" href="#">MySQL Server 4</a>
          </li>
          <li role="presentation" >
            <a className="grey-color" href="#">MySQL Server 5</a>
          </li>
          <li role="presentation" className="active">
            <a className="grey-color" href="#">New Dashboard</a>
          </li>
        </ul>
        <div className="section-content">
          <div className="row margin-tops">
            <div className="col-xs-3 centered">
              <div className="input-group">
                <div className="input-group-addon">
                  <i className="fa fa-cubes" aria-hidden="true"></i>
                </div>
                <select className="form-control">
                  <option>Select icon</option>
                </select>
              </div>
            </div>
            <div className="col-xs-4">
              <div className="form-group">
                <div className="input-group">
                  <div className="input-group-addon">
                    <i className="fa fa-area-chart" aria-hidden="true"></i>
                  </div>
                  <input type="text" className="form-control no-shadow" id="integrationName" placeholder="New Dashboard Performance Name"/>
                </div>
              </div>
            </div>
            <button className="green-button">Save</button>
          </div>
          <div className="row margin-sides">
            <div className="col-xs-6 right-div">
              <div className="title-div">
                <p className="widget-p">Widget</p>
              </div>
              <div className="inside-div">
                <select className="form-control select-margin" id="widgetType">
                  <option>Select Widget Type</option>
                  <option>2</option>
                </select>
                <select className="form-control select-margin" id="server">
                  <option>Select Server</option>
                  <option>2</option>
                </select>
                <select className="form-control select-margin" id="chartType">
                  <option>Select Chart Type</option>
                  <option>2</option>
                </select>
                <button className="green-button">Save</button>
              </div>
            </div>
            <div className="col-xs-6 right-div">
              <div className="title-div">
                <p className="widget-p">Widget</p>
              </div>
              <div className="inside-div">
                <select className="form-control select-margin" id="widgetType">
                  <option>Select Widget Type</option>
                  <option>2</option>
                </select>
                <select className="form-control select-margin" id="server">
                  <option>Select Server</option>
                  <option>2</option>
                </select>
                <select className="form-control select-margin" id="chartType">
                  <option>Select Chart Type</option>
                  <option>2</option>
                </select>
                <button className="green-button">Save</button>
              </div>
            </div>
          </div>
          <div className="row margin-sides">
            <div className="col-xs-6 right-div">
              <div className="title-div">
                <p className="widget-p">Widget</p>
              </div>
              <div className="inside-div">
                <select className="form-control select-margin" id="widgetType">
                  <option>Select Widget Type</option>
                  <option>2</option>
                </select>
                <select className="form-control select-margin" id="server">
                  <option>Select Server</option>
                  <option>2</option>
                </select>
                <select className="form-control select-margin" id="chartType">
                  <option>Select Chart Type</option>
                  <option>2</option>
                </select>
                <button className="green-button">Save</button>
              </div>
            </div>
            <div className="col-xs-6 right-div">
              <div className="title-div">
                <p className="widget-p">Widget</p>
              </div>
              <div className="inside-div">
                <select className="form-control select-margin" id="widgetType">
                  <option>Select Widget Type</option>
                  <option>2</option>
                </select>
                <select className="form-control select-margin" id="server">
                  <option>Select Server</option>
                  <option>2</option>
                </select>
                <select className="form-control select-margin" id="chartType">
                  <option>Select Chart Type</option>
                  <option>2</option>
                </select>
                <button className="green-button">Save</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
});

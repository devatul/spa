var React                      = require('react');
var Router                     = require('../router');
var redirect                   = require('../actions/RouteActions').redirect;
var SessionStore               = require('../stores/SessionStore');
var CreateGraph                = require('./Create_graph.react');

module.exports = React.createClass({

  render: function () {
    return (
      <div className="">
        <ul className="nav nav-tabs section-tabs">
          <li role="presentation">
            <a className="grey-color" href="#">Custom Dashboard 1</a>
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
            <div className="col-lg-4 col-md-4 col-sm-12 col-xs-12">
              <div className="widget create">
                <CreateGraph position={1}/>
              </div>
            </div>
            <div className="col-lg-4 col-md-4 col-sm-12 col-xs-12">
              <div className="widget create">
                <CreateGraph position={2}/>
              </div>
            </div>
            <div className="col-lg-4 col-md-4 col-sm-12 col-xs-12">
              <div className="widget create">
                <CreateGraph position={3}/>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  },
});

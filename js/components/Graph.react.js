var React                      = require('react');
var Router                     = require('../router');
var redirect                   = require('../actions/RouteActions').redirect;
var SessionStore               = require('../stores/SessionStore');
var getDashboard               = require('../actions/RequestActions').getDashboard;
var SessionStore               = require('../stores/SessionStore');
var GraphStore                 = require('../stores/GraphStore');
var Highcharts                 = require('highcharts');
var addFunnel                  = require('highcharts/modules/funnel');

module.exports = React.createClass({

  getInitialState: function () {
    var dashboard = GraphStore.getDashboard();
    return {
      dashboard: dashboard,
    };
  },

  componentDidMount: function () {
    GraphStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function () {
    GraphStore.removeChangeListener(this._onChange);
  },

  _onChange: function () {
    if (this.isMounted()) {
      var dashboard = GraphStore.getDashboard();
      this.setState({
        dashboard: dashboard,
      });
    }
  },

  render: function () {
    var dashboard = this.state.dashboard;

    if (undefined != dashboard) {

      var name = JSON.stringify(dashboard[2].content.name);
      name = name.replace(/\"/g, '');
      var interval = dashboard[2].custom_interval;
      var interval_name;

      switch (interval) {
        case 'TODAY':
          interval_name = 'Today\'s';
          break;
        case 'THIS_WEEK':
          interval_name = 'this week';
          break;
        case 'THIS_MONTH':
          interval_name = 'this month';
          break;
        case 'YESTERDAY':
          interval_name = 'Yesterday\'s';
          break;
        case 'LAST_WEEK':
          interval_name = 'last week';
          break;
        case 'LAST_TWO_WEEKS':
          interval_name = 'last two weeks';
          break;
        case 'LAST_MONTH':
          interval_name = 'last month';
          break;
        default:
          interval_name = '';
      }

      var slot_name;
      if ('TODAY' == interval || 'YESTERDAY' == interval) {
        slot_name = interval_name + ' ' + name;
      } else {
        slot_name = name + ' ' + interval_name;
      }

      addFunnel(Highcharts);

      var series = [];
      for (var i = 0; i < dashboard[2].content.series.length; i++) {
        series[i] = dashboard[2].content.series[i];
      }

      var legend1 = series[0].legend;
      var data1 = series[0].data;
      var legend2 = series[1].legend;
      var data2 = series[1].data;
      var legend3 = series[2].legend;
      var data3 = series[2].data;

      var coords1 = [];
      for (var i = 0; i < data1.length; i++) {
        coords1[i] = data1[i][1];
      }

      var coords2 = [];
      for (var i = 0; i < data2.length; i++) {
        coords2[i] = data2[i][1];
      }

      var coords3 = [];
      for (var i = 0; i < data3.length; i++) {
        coords3[i] = data3[i][1];
      }

      var chart = Highcharts.chart;

      Highcharts.chart('container', {
        chart: {
          zoomType: 'x'
        },
        title: {
          text: slot_name,
          x: -20
        },
        xAxis: {
          categories: ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat',]
        },
        yAxis: {
          plotLines: [{
            value: 0,
            width: 1,
            color: '#808080'
          }]
        },
        legend: {
          layout:'vertical',
          align: 'right',
          verticalAlign: 'middle',
          borderWidth: 0
        },
        series: [{
          name: legend1,
          data: coords1
        }, {
          name: legend2,
          data: coords2
        }, {
          name: legend3,
          data: coords3
        }]
      });
    }

    return (
      <div id="container">
      </div> 
    );
  }
    
});

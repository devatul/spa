var React                      = require('react');
var Router                     = require('../router');
var redirect                   = require('../actions/RouteActions').redirect;
var SessionStore               = require('../stores/SessionStore');
var GraphStore                 = require('../stores/GraphStore');
var Highcharts                 = require('highcharts');
var addFunnel                  = require('highcharts/modules/funnel');

module.exports = React.createClass({

  componentDidMount: function () {
    GraphStore.addChangeListener(this._onChange);
      var name = JSON.stringify(this.props.graph.content.name);
      name = name.replace(/\"/g, '');
      var interval = this.props.graph.custom_interval;
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
      for (var i = 0; i < this.props.graph.content.series.length; i++) {
        series[i] = this.props.graph.content.series[i];
      }

      var legend1 = series[0].legend;
      var data1   = series[0].data;
      var coords1 = [];
      for (var i = 0; i < data1.length; i++) {
        coords1[i] = data1[i][1];
      }

      var chart = Highcharts.chart;

      Highcharts.chart(this.props.name, {
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
          borderWidth: 0,
          fontFamily: 'neosanslight'
        },
        series: [{
          name: legend1,
          data: coords1
        }]
      });
  },

  componentWillUnmount: function () {
    GraphStore.removeChangeListener(this._onChange);
  },

  _onChange: function () {

  },

  render: function () {

    return (
      <div id={this.props.name}>
      </div>
    );
  }
});

var React                      = require('react');
var Router                     = require('../router');
var redirect                   = require('../actions/RouteActions').redirect;
var getUserData                = require('../actions/StorageActions').getUserData;
var SessionStore               = require('../stores/SessionStore');
var GraphStore                 = require('../stores/GraphStore');
var addFunnel                  = require('highcharts/modules/funnel');
var GraphEmptyState            = require('./Graph_empty_state.react');
var moment                     = require('moment');
var momentTZ                   = require('moment-timezone');
window.moment = moment;
var Highcharts                 = require('highcharts');

class Graph extends React.Component {

  componentDidMount() {
    GraphStore.addChangeListener(this._onChange);
    if (null !== this.props.graph.content) {
      var graph = this.props.graph;
      var name = JSON.stringify(graph.content.name);
      name = name.replace(/\"/g, '');
      var interval = graph.custom_interval;
      var interval_name;
      var hostname = graph.hostname;
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
      var chartSeries = [];

      for (var i = 0; i < graph.content.series.length; i++) {
        var data1   = graph.content.series[i].data;
        var legend = graph.content.series[i].legend;
        var color = graph.content.series[i].color;
        var suffix = graph.content.series[i].unit;
        var coords = [];

        for (var key = 0; key < data1.length; key++) {
          coords[key] = [data1[key][0] * 1000, data1[key][1]];
        }

        if (0 < data1.length) {
          var offset = moment.tz(data1[0][0] * 1000, getUserData('timezone')).format('(UTC Z)');
        }

        var chartSerie = {
          name:    legend,
          data:    coords,
          color:   color,
          tooltip: {
            headerFormat:  '{point.key} ' + offset + '<br/>',
            valueDecimals: 2,
            valueSuffix:   ' ' + suffix,
          },
        };
        chartSeries.push(chartSerie);
      }
      var yTitle = 'Values';

      if (graph.content.series[0].unit) {
        yTitle = 'Values (' + graph.content.series[0].unit + ')';
      }

      if (getUserData('timezone')) {
        Highcharts.setOptions({
          global: {
            timezone: getUserData('timezone'),
          },
        });
      }

      Highcharts.chart(this.props.name, {
        'chart': {
          'type':          'spline',
          'zoomType':      'x',
          'className':     'hichart-main-container',
          'spacingBottom': 10,
          'spacingTop':    30,
          'spacingLeft':   10,
          'spacingRight':  10,
        },

        'exporting': {
          'enabled': false,
        },

        'credits': {
          'enabled': false,
        },

        'title': {
          'text': slot_name + ' of ' + hostname,
        },

        'tooltip': {
          'shared':          true,
          'crosshairs':      true,
          'backgroundColor': '#717171',
          'borderColor':     'black',
          'borderRadius':    10,
          'borderWidth':     0,
          'style':           {
            'color': 'white',
          },
        },

        'xAxis': {
          'type':                 'datetime',
          'dateTimeLabelFormats': {
            'second': '%H:%M:%S',
            'minute': '%H:%M',
            'hour':   '%H:%M',
            'day':    '%e. %b',
            'week':   '%e. %b',
            'month':  '%b \'%y',
            'year':   '%Y',
          },
          'title': {
            'text': 'Date',
          },
        },

        'yAxis': {
          'title': {
            'text': yTitle,
          },
          'opposite':   false,
          'min':        0,
          'maxPadding': 0.2,
          'plotLines':  [{
            'value': 0,
            'width': 1,
            'color': '#808080',
          }],
        },

        'legend': {
          'enabled':       false,
          'align':         'center',
          'verticalAlign': 'bottom',
        },

        'navigator': {
          'height': 25,
        },

        'rangeSelector': {
          'enabled': false,
        },
        'series':     chartSeries,
        'responsive': {
          'rules': [{
            'condition': {
              'maxHeight': 280,
            },
          }],
        },
      });
    }
  }

  componentWillUnmount() {
    GraphStore.removeChangeListener(this._onChange);
  }

  _onChange() {

  }

  render() {
    if (null !== this.props.graph.content) {
      return (
        <div id={this.props.name} style={{'width': '100%'}}>
        </div>
      );
    }

    return (
      <GraphEmptyState />
    );
  }
}

module.exports = Graph;

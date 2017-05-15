var React                      = require('react');
var getUserData                = require('../actions/StorageActions').getUserData;
var GraphStore                 = require('../stores/GraphStore');
var Highcharts                 = require('highcharts');
var addFunnel                  = require('highcharts/modules/funnel');
var GraphEmptyState            = require('./Graph_empty_state.react');

class ModalGraph extends React.Component {
  constructor(props) {
    super(props);
    this._onChange = this._onChange.bind(this);
  }

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
        var pointStart = new Date();

        if (undefined !== data1[0] && undefined !== data1[0][0]) {
          pointStart = data1[0][0] * 1000;
        }
        var legend = graph.content.series[i].legend;
        var color = graph.content.series[i].color;
        var suffix = graph.content.series[i].unit;
        var coords = [];
        for (var key = 0; key < data1.length; key++) {
          coords[key] = [new Date(data1[key][0] * 1000), data1[key][1]];
        }

        var chartSerie = {
          name:          legend,
          data:          coords,
          color:         color,
          pointStart:    pointStart,
          pointInterval: 1 * 3600 * 24,
          tooltip:       {
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

      Highcharts.setOptions({
        global: {
          timezone: getUserData('timezone'),
        },
      });

      Highcharts.chart(this.props.name, {
        chart: {
          zoomType:  'x',
          className: 'hichart-main-container',
        },

        exporting: {
          enabled: false,
        },

        credits: {
          enabled: false,
        },

        title: {
          text: slot_name,
        },

        subtitle: {
          text: hostname,
        },

        tooltip: {
          shared:     true,
          crosshairs: true,
        },

        xAxis: {
          type:                 'datetime',
          dateTimeLabelFormats: {
            second: '%H:%M:%S',
            minute: '%H:%M',
            hour:   '%H:%M',
            day:    '%e. %b',
            week:   '%e. %b',
            month:  '%b \'%y',
            year:   '%Y',
          },
          title: {
            text: 'Date',
          },
        },

        yAxis: {
          title: {
            text: yTitle,
          },
          opposite:   false,
          min:        0,
          maxPadding: 0.2,
          plotLines:  [{
            value: 0,
            width: 1,
            color: '#808080',
          }],
        },

        legend: {
          enabled:       true,
          align:         'center',
          verticalAlign: 'bottom',
        },

        navigator: {
          height: 25,
        },

        rangeSelector: {
          enabled: false,
        },
        series: chartSeries,
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
        <div id={this.props.name} style={{'width': '100%', 'height': '100%'}}>
        </div>
      );
    }

    return (
      <GraphEmptyState />
    );
  }
}

module.exports = ModalGraph;

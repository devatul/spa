var React                      = require('react');
var Router                     = require('../router');
var redirect                   = require('../actions/RouteActions').redirect;
var getBillingHistory          = require('../actions/RequestActions').getBillingHistory;
var SessionStore               = require('../stores/SessionStore');
var OnboardingStore            = require('../stores/OnBoardingStore');

module.exports = React.createClass({
  getInitialState: function () {
    var history = OnboardingStore.getBillingHistory();
    return {
      history: history,
    };
  },

  componentDidMount: function () {
    getBillingHistory();
    OnboardingStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function () {
    OnboardingStore.removeChangeListener(this._onChange);
  },

  _onChange: function () {
    if (this.isMounted()) {
      var history = OnboardingStore.getBillingHistory();
      this.setState({
        history: history,
      });
    }
  },

  render: function () {
    if (0 >= this.state.history.length) {
      return (
        <div className="centered">
          <h3 className="grey-text">There are no invoices.</h3>
        </div>
      );
    }
    var rows = [];
    for (var key in this.state.history) {
      rows.push(
        <tr>
          <th>
            <time>{this.state.history[key].date}</time>
          </th>
          <td>
            <time>{this.state.history[key].due_date}</time>
          </td>
          <td>{this.state.history[key].status}</td>
          <td>{this.state.history[key].total}</td>
        </tr>
      );
    }
    return (
      <div className="col-xs-12">
        <table className="table table-condensed">
          <thead>
            <tr>
              <th className="light-grey-background">Invoice date</th>
              <th className="light-grey-background">Due date</th>
              <th className="light-grey-background">Status</th>
              <th className="light-grey-background">Total</th>
            </tr>
          </thead>
          <tbody>
            {rows}
          </tbody>
        </table>
      </div>
    );
  },
});

var React                      = require('react');
// var getBillingHistory          = require('../actions/RequestActions').getBillingHistory;
var OnboardingStore            = require('../stores/OnBoardingStore');

class BillingHistorySection extends React.Component {
  constructor(props) {
    super(props);
    var history = OnboardingStore.getBillingHistory();
    this.state = {
      history: history,
    };
    this._onChange = this._onChange.bind(this);
  }

  componentDidMount() {
    // getBillingHistory();
    OnboardingStore.addChangeListener(this._onChange);
  }

  componentWillUnmount() {
    OnboardingStore.removeChangeListener(this._onChange);
  }

  _onChange() {
    // var history = OnboardingStore.getBillingHistory();
    // this.setState({
    //   history: history,
    // });
  }

  render() {
    if (this.state.history && 0 >= this.state.history.length) {
      return (
        <div className="centered">
          <h3 className="grey-text">There are no invoices.</h3>
        </div>
      );
    }
    var rows = [];
    // for (var key in this.state.history) {
    //   rows.push(
    //     <tr>
    //       <th>
    //         <time>{this.state.history[key].date}</time>
    //       </th>
    //       <td>
    //         <time>{this.state.history[key].due_date}</time>
    //       </td>
    //       <td>{this.state.history[key].status}</td>
    //       <td>{this.state.history[key].total}</td>
    //     </tr>
    //   );
    // }
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
  }
}

module.exports = BillingHistorySection;

var React                      = require('react');
var Router                     = require('../router');
var moment                     = require('moment');
var redirect                   = require('../actions/RouteActions').redirect;
var SessionStore               = require('../stores/SessionStore');
var NinjaStore                 = require('../stores/NinjaStore');
var getNinja                   = require('../actions/RequestActions').getNinja;
var Preloader                  = require('./Preloader.react');
var getTicket                  = require('../actions/RequestActions').getTicket;
var viewTicket                 = require('../actions/ServerActions').viewTicket;

module.exports = React.createClass({
  getInitialState: function () {
    var ninja = NinjaStore.getNinja();
    return {
      ninja: ninja.member,
      totalItems: ninja.totalItems,
    };
  },

  componentDidMount: function () {
    getNinja(0);
    NinjaStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function () {
    NinjaStore.removeChangeListener(this._onChange);
  },

  _onChange: function () {
    if (this.isMounted()) {
      var ninja = NinjaStore.getNinja();
      this.setState({
        ninja: ninja.member,
        totalItems: ninja.totalItems,
      });
    }
    if (NinjaStore.isViewingTicket()) {
        redirect('view_ticket');
    }
  },

  _viewTicket: function (ticket) {
    viewTicket(ticket);
  },

  _newPage: function (page) {
    getNinja(page);
  },

  render: function () {
    var ticket = this.state.ninja;
    var totalItems = this.state.totalItems;
    var pages = Math.ceil(parseInt(totalItems)/10);

    if (ticket !== undefined) {
      var navpages = [];
      for (var key = 0 ; key < pages ; key++) {
        var page = key + 1;
        var send = page.toString();
        navpages[navpages.length] = <li><a onClick={this._newPage.bind(this, page)}>{page}</a></li>;
      }

      var paginatorClass;
      if (pages <= 1) {
        paginatorClass = 'hidden';
      }

      var from = moment(ticket[key].created_at).format('DD/MM/YYYY hh:mm:ss');

      var rows = [];
      for (var key in ticket) {
        var status = '';
        var department_icon = '';
        var department_name = '';
        var priority = '';

        if ('open' == ticket[key].status) {
          status = 'icon nb-ticket icon-state blue-text';
        } else {
          status = 'icon nb-ticket icon-state green-text';
        }

        if ('billing' == ticket[key].department) {
          department_icon = 'icon nb-billing icon-state';
          department_name = 'Billing';
        } else if ('sales' == ticket[key].department) {
          department_icon = 'icon nb-sales icon-state';
          department_name = 'Sales';
        } else {
          department_icon = 'icon nb-ninja-support icon-state';
          department_name = 'Ninja Support';
        }

        if ('low' == ticket[key].priority) {
          priority = 'sprites priority-1';
        } else if ('medium' == ticket[key].priority) {
          priority = 'sprites priority-2';
        } else {
          priority = 'sprites priority-3';
        }
        rows.push(
          <tr key={key}>
            <td className="icons"><span className={status}></span></td>
            <td>{ticket[key].name}</td>
            <td>{ticket[key].subject}</td>
            <td>
              <span className={priority}></span>
            </td>
            <td>
              <i className={department_icon} aria-hidden="true"></i>  {department_name}
            </td>
            <td>{ticket[key].hostname}</td>
            <td>
              <time dateTime={ticket[key].created_at}>{from}</time>
            </td>
            <td className="icons">
              <span className="action-button nubity-blue" onClick={this._viewTicket.bind(this, ticket[key])}>View ticket</span>
            </td>
          </tr>
        );
      }
    }

    if (!ticket) {
      return (
        <Preloader />
      );
    }
    return (
      <div>
        <table>
          <tr>
            <th className="column-icon">Status</th>
            <th>Ticket Id</th>
            <th>Subject</th>
            <th className="column-icon">Priority</th>
            <th className="column-button">Department</th>
            <th>Server</th>
            <th>Date</th>
            <th className="column-button">View Ticket</th>
          </tr>
          <tbody>
            {rows}
          </tbody>
        </table>
        <nav aria-label="Page navigation" className={paginatorClass}>
          <ul className="pagination">
            <li>
              <a aria-label="Previous">
                <span aria-hidden="true">&laquo;</span>
              </a>
            </li>
            {navpages}
            <li>
              <a aria-label="Next">
                <span aria-hidden="true">&raquo;</span>
              </a>
            </li>
          </ul>
        </nav>
      </div>
    );
  },
});

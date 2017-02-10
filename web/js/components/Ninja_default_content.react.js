var React                      = require('react');
var moment                     = require('moment');
var redirect                   = require('../actions/RouteActions').redirect;
var NinjaStore                 = require('../stores/NinjaStore');
var getNinja                   = require('../actions/RequestActions').getNinja;
var Preloader                  = require('./Preloader.react');
var getTicket                  = require('../actions/RequestActions').getTicket;
var viewTicket                 = require('../actions/ServerActions').viewTicket;
var Tooltip                    = require('react-bootstrap').Tooltip;
var OverlayTrigger             = require('react-bootstrap').OverlayTrigger;
var Link                       = require('react-router').Link;

module.exports = React.createClass({
  getInitialState: function () {
    var ninja = NinjaStore.getNinja();
    return {
      ninja: ninja.member,
      totalItems: ninja.totalItems,
      loading: false,
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
        loading: false,
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
    this.setState({
      loading: true,
    });
    getNinja(page);
  },

  render: function () {
    var ticket = this.state.ninja;
    var totalItems = this.state.totalItems;
    var pages = Math.ceil(parseInt(totalItems)/10);
    var content;

    if (ticket !== undefined) {
      var navpages = [];
      for (var key = 0 ; key < pages ; key++) {
        var page = key + 1;
        var send = page.toString();
        navpages[navpages.length] = <li><a onClick={this._newPage.bind(this, page)}>{page}</a></li>;
      }

      var paginatorClass;
      if (1 >= pages) {
        paginatorClass = 'hidden';
      }

      var from = moment(ticket[key].created_at).format('DD/MM/YYYY hh:mm:ss');

      var rows = [];
      for (var key in ticket) {
        var status = '';
        var department_icon = '';
        var department_name = '';
        var priority = '';
        var tooltip = '';
        var priorityTooltip = '';

        if ('open' == ticket[key].status) {
          status = 'icon nb-ticket icon-state blue-text';
          tooltip = (<Tooltip id="tooltip">Open</Tooltip>);
        } else {
          status = 'icon nb-ticket icon-state green-text';
          tooltip = (<Tooltip id="tooltip">Closed</Tooltip>);
        }

        if ('billing' == ticket[key].department) {
          department_icon = 'icon nb-billing icon-state';
          department_name = 'Billing';
        } else if ('sales' == ticket[key].department) {
          department_icon = 'icon nb-sales icon-state';
          department_name = 'Sales';
        } else {
          department_icon = 'icon nb-ninja-support icon-state';
          department_name = 'Support';
        }

        if ('low' == ticket[key].priority) {
          priority = 'icon nb-level-low green-text icon-state';
          priorityTooltip = (<Tooltip id="tooltip">Low</Tooltip>);
        } else if ('medium' == ticket[key].priority) {
          priority = 'icon nb-level-medium yellow-text icon-state';
          priorityTooltip = (<Tooltip id="tooltip">Medium</Tooltip>);
        } else {
          priority = 'icon nb-level-high red-text icon-state';
          priorityTooltip = (<Tooltip id="tooltip">High</Tooltip>);
        }
        rows.push(
          <tr key={key}>
            <td className="icons">
              <OverlayTrigger placement="top" overlay={tooltip}>
                <span className={status}></span>
              </OverlayTrigger>
            </td>
            <td className="ticket-id-name" title="View ticket">
              <Link to="view_ticket_params" params={{id: ticket[key].ticket}}>{ticket[key].name}</Link>
            </td>
            <td>{ticket[key].subject}</td>
            <td className="icons">
              <OverlayTrigger placement="top" overlay={priorityTooltip}>
                <span className={priority}></span>
              </OverlayTrigger>
            </td>
            <td className="hidden-xs">
              <i className={department_icon} aria-hidden="true"></i>  {department_name}
            </td>
            <td className="hidden-xs">{ticket[key].hostname}</td>
            <td className="hidden-xs hidden-sm">
              <time dateTime={ticket[key].created_at}>{from}</time>
            </td>
          </tr>
        );
      }
    }

    if (this.state.loading) {
      content = (
        <div>
          <table>
            <thead>
              <tr>
                <th className="column-icon">Status</th>
                <th>Ticket Id</th>
                <th>Subject</th>
                <th className="column-icon">Priority</th>
                <th className="column-button hidden-xs">Department</th>
                <th className="hidden-xs">Device</th>
                <th className="hidden-xs hidden-sm">Date</th>
              </tr>
            </thead>
          </table>
          <Preloader />
        </div>
      );
    } else {
      if (0 == totalItems) {
        content = (
          <div className="empty-table">
            <i className="icon nb-ticket x-large grey-text"></i>
            <h1 className="grey-text">There are no Support tickets yet.</h1>
          </div>
        );
      } else {
        content = (
          <table>
            <thead>
              <tr>
                <th className="column-icon">Status</th>
                <th>Ticket Id</th>
                <th>Subject</th>
                <th className="column-icon">Priority</th>
                <th className="column-button hidden-xs">Department</th>
                <th className="hidden-xs">Device</th>
                <th className="hidden-xs hidden-sm">Date</th>
              </tr>
            </thead>
            <tbody>
              {rows}
            </tbody>
          </table>
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
        {content}
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

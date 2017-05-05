var React                      = require('react');
var moment                     = require('moment');
var redirect                   = require('../actions/RouteActions').redirect;
var NinjaStore                 = require('../stores/NinjaStore');
var getNinja                   = require('../actions/RequestActions').getNinja;
var Preloader                  = require('./Preloader.react');
var getUserData                = require('../actions/StorageActions').getUserData;
var getLocaleDateFormat        = require('../actions/StorageActions').getLocaleDateFormat;
var getTicket                  = require('../actions/RequestActions').getTicket;
var viewTicket                 = require('../actions/ServerActions').viewTicket;
var Tooltip                    = require('react-bootstrap').Tooltip;
var OverlayTrigger             = require('react-bootstrap').OverlayTrigger;
var Link                       = require('react-router').Link;

class NinjaDefaultContent extends React.Component {
  constructor(props) {
    super(props);
    var ninja = NinjaStore.getNinja();
    this.state = {
      ninja:      ninja.member,
      totalItems: ninja.totalItems,
      loading:    false,
      totalPages: 0,
      pageNo:     1,
    };
    this._onChange = this._onChange.bind(this);
    this._updatePage = this._updatePage.bind(this);
    this.updateURL = this.updateURL.bind(this);
    this._newPage = this._newPage.bind(this);
  }

  componentDidMount() {
    getNinja(0);
    NinjaStore.addChangeListener(this._onChange);
  }

  componentWillUnmount() {
    NinjaStore.removeChangeListener(this._onChange);
  }

  componentDidUpdate() {
    var _uri = this._getURI();
    if (_uri.pageNo != this.state.pageNo) {
      this._updatePage(_uri.pageNo);
    }
  }

  _getURI() {
    var hash = window.location.href.split('/ninja-support')[1] || '';
    var pageNo = 1;
    if ('' !== hash) {
      var arr = hash.split('#page=');
      hash = arr[0];
      pageNo = parseInt(arr[1]);
    }
    return {hash: hash, pageNo: pageNo};
  }

  _onChange() {
    var ninja = NinjaStore.getNinja();
    this.setState({
      ninja:      ninja.member,
      totalItems: ninja.totalItems,
      loading:    false,
      totalPages: Math.ceil(parseInt(ninja.totalItems) / 10),
    });
    if (NinjaStore.isViewingTicket()) {
      redirect('view-ticket');
    }
  }

  _viewTicket(ticket) {
    viewTicket(ticket);
  }

  _updatePage(page) {
    var i = false;
    if (0 < page && page <= this.state.totalPages) {
      this._newPage(page);
      i = true;
    }

    if (i) {
      this.updateURL(page);
    }
  }

  updateURL(pageNo) {
    this.setState({
      pageNo: pageNo,
    });
    var hash = window.location.href.split('/ninja-support');
    window.location.href = hash[0] + '/ninja-support#page=' + pageNo;
  }

  _newPage(page) {
    this.setState({
      loading: true,
    });
    getNinja(page);
  }

  render() {
    var ticket = this.state.ninja;
    var totalItems = this.state.totalItems;
    var pages = Math.ceil(parseInt(totalItems) / 10);
    var content;

    if (ticket !== undefined) {
      var navpages = [];
      for (var key = 0 ; key < pages ; key++) {
        var page = key + 1;
        navpages[navpages.length] = <li key={navpages.length} className={this.state.pageNo == page ? 'active' : ''}><a onClick={this._updatePage.bind(this, page)}>{page}</a></li>;
      }

      var paginatorClass;
      if (1 >= pages) {
        paginatorClass = 'hidden';
      } else {
        paginatorClass = 'pull-right';
      }

      var rows = [];
      var userTimeZone = getUserData('timezone');
      var locale = getUserData('locale');
      moment.locale(locale);
      for (key in ticket) {
        var status = '';
        var department_icon = '';
        var department_name = '';
        var priority = '';
        var tooltip = '';
        var priorityTooltip = '';
        var date_obj = moment.tz(ticket[key].created_at, userTimeZone).toDate();
        var from = date_obj.toLocaleDateString() + ' ' + date_obj.toLocaleTimeString();

        tooltip = <Tooltip id="tooltip" style={{textTransform: 'capitalize'}}>{ticket[key].status}</Tooltip>;
        status = 'icon nb-ticket icon-state ';
        if ('open' == ticket[key].status) {
          status = status + 'blue-text';
        } else if ('closed' == ticket[key].status) {
          status = status + 'green-text';
        } else if ('in-progress' == ticket[key].status) {
          status = status + 'grey-text';
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
          <tr key={key} className="content">
            <td className="icons">
              <OverlayTrigger placement="top" overlay={tooltip}>
                <span className={status}></span>
              </OverlayTrigger>
            </td>
            <td className="ticket-id-name" title="View ticket">
              <Link className="ticket-id-name" to={`/view-ticket/${ticket[key].ticket}`} >{ticket[key].name}</Link>
            </td>
            <td className="left-aligned">{ticket[key].subject}</td>
            <td className="icons">
              <OverlayTrigger placement="top" overlay={priorityTooltip}>
                <span className={priority}></span>
              </OverlayTrigger>
            </td>
            <td className="hidden-xs">
              <i className={department_icon} aria-hidden="true"></i> {department_name}
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
    } else if (0 == totalItems) {
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
              <a aria-label="Previous" onClick={this._updatePage.bind(this, this.state.pageNo - 1)}>
                <span aria-hidden="true">&laquo;</span>
              </a>
            </li>
            {navpages}
            <li>
              <a aria-label="Next" onClick={this._updatePage.bind(this, this.state.pageNo + 1)}>
                <span aria-hidden="true">&raquo;</span>
              </a>
            </li>
          </ul>
        </nav>
      </div>
    );
  }
}

module.exports = NinjaDefaultContent;

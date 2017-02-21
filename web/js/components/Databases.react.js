var React                      = require('react');
var moment                     = require('moment');
var Switch                     = require('rc-switch');
var Carousel                   = require('react-bootstrap').Carousel;
var CarouselItem               = require('react-bootstrap').CarouselItem;

module.exports = React.createClass({
  getInitialState: function () {
    return {
      disabled: false,
    };
  },

  render: function () {
    var rows = [];
    var install;

    return (
      <div>
        <div>
          <Carousel data-interval="false" controls="false">
            <CarouselItem>
              <div className="col-sm-8 col-sm-offset-2">
                <div className="col-sm-3">
                  <a className="thumbnail">
                    <img src="../images/nubity-logo-hd.png'" alt="Image" className="img-responsive"/>
                  </a>
                </div>
                <div className="col-sm-3">
                  <a className="thumbnail">
                    <img src="../images/nubity-logo-hd.png'" alt="Image" className="img-responsive"/>
                  </a>
                </div>
                <div className="col-sm-3">
                  <a className="thumbnail">
                    <img src="../images/nubity-logo-hd.png'" alt="Image" className="img-responsive"/>
                  </a>
                </div>
                <div className="col-sm-3">
                  <a className="thumbnail">
                    <img src="../images/nubity-logo-hd.png'" alt="Image" className="img-responsive"/>
                  </a>
                </div>
              </div>
            </CarouselItem>
            <CarouselItem>
              <div className="col-sm-8 col-sm-offset-2">
                <div className="col-sm-3">
                  <a className="thumbnail">
                    <img src="../images/nubity-logo-hd.png" alt="Image" className="img-responsive"/>
                  </a>
                </div>
                <div className="col-sm-3">
                  <a className="thumbnail">
                    <img src="../images/nubity-logo-hd.png" alt="Image" className="img-responsive"/>
                  </a>
                </div>
                <div className="col-sm-3">
                  <a className="thumbnail">
                    <img src="../images/nubity-logo-hd.png" alt="Image" className="img-responsive"/>
                  </a>
                </div>
                <div className="col-sm-3">
                  <a className="thumbnail">
                    <img src="../images/nubity-logo-hd.png" alt="Image" className="img-responsive"/>
                  </a>
                </div>
              </div>
            </CarouselItem>
            <CarouselItem>
              <div className="col-sm-8 col-sm-offset-2">
                <div className="col-sm-3">
                  <a className="thumbnail">
                    <img src="../images/nubity-logo-hd.png"  alt="Image" className="img-responsive"/>
                  </a>
                </div>
                <div className="col-sm-3">
                  <a className="thumbnail">
                    <img src="../images/nubity-logo-hd.png" alt="Image" className="img-responsive"/>
                  </a>
                </div>
                <div className="col-sm-3">
                  <a className="thumbnail">
                    <img src="../images/nubity-logo-hd.png" alt="Image" className="img-responsive"/>
                  </a>
                </div>
                <div className="col-sm-3">
                  <a className="thumbnail">
                    <img src="../images/nubity-logo-hd.png" alt="Image" className="img-responsive"/>
                  </a>
                </div>
              </div>
            </CarouselItem>
          </Carousel>
        </div>
        <table>
          <thead>
            <tr>
              <th colSpan="4">Items description</th>
              <th colSpan="4">Triggers</th>
            </tr>
            <tr>
              <th>Name</th>
              <th>Last Check</th>
              <th>Last Value</th>
              <th>Prev. Value</th>
              <th>State</th>
              <th>Condition</th>
              <th>Treshold</th>
              <th>Priority</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>My SQL begin opeerations per second</td>
              <td>moment().format('DD/MM/YYYY hh:mm:ss');</td>
              <td>00.00%</td>
              <td>00.00%</td>
              <td>
                <Switch/>
              </td>
              <td>00000%</td>
              <td>0000%</td>
              <td><i className="icon nb-critical icon-state red-text" aria-hidden="true"></i></td>
            </tr>
            <tr>
              <td>My SQL begin opeerations per second</td>
              <td>moment().format('DD/MM/YYYY hh:mm:ss');</td>
              <td>00.00%</td>
              <td>00.00%</td>
              <td>00.00%</td>
              <td>00000%</td>
              <td>0000%</td>
              <td>00.00%</td>
            </tr>
            <tr>
              <td>My SQL begin opeerations per second</td>
              <td>moment().format('DD/MM/YYYY hh:mm:ss');</td>
              <td>00.00%</td>
              <td>00.00%</td>
              <td>00.00%</td>
              <td>00000%</td>
              <td>0000%</td>
              <td>00.00%</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  },
});

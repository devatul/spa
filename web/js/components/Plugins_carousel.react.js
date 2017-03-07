var React        = require('react');
var Carousel     = require('react-bootstrap').Carousel;
var CarouselItem = require('react-bootstrap').CarouselItem;

module.exports = React.createClass({
  getInitialState: function () {
    return {
      index: 0,
      direction: null
    };
  },

  handleSelect: function (selectedIndex, e) {
    this.setState({
      index: selectedIndex,
      direction: e.direction
    });
  },

  clickTemplate: function (template) {
    this.setState({
      active: template.template,
    });
    this.props.clickTemplate(template);
  },

  render: function () {
    var templates = this.props.templates;
    var rows = [];
    if (templates !== undefined) {
      for (key = 0; key < templates.length; key = key+4) { 
        rows.push(
          <CarouselItem>
          <div className="col-sm-8 col-sm-offset-2">
            <div className={templates[key] !== undefined ? 'col-sm-3' : 'hidden'}>
              <a className={templates[key] !== undefined && this.state.active == templates[key].template ? 'carousel-active thumbnail' : 'thumbnail'} >
                <img src={templates[key] !== undefined ? templates[key].logo : ''} alt="Image" className="img-responsive" onClick={this.clickTemplate.bind(this, templates[key])}/>
                <div className="is-installed-container"><span className={templates[key] !== undefined && templates[key].is_installed == true ? 'is-installed' : 'hidden'}></span></div>
              </a>
            </div>
            <div className={templates[key+1] !== undefined ? 'col-sm-3' : 'hidden'}>
              <a className={templates[key+1] !== undefined && this.state.active == templates[key+1].template ? 'carousel-active thumbnail' : 'thumbnail'} >
                <img src={templates[key+1] !== undefined ? templates[key+1].logo : ''} className="img-responsive" onClick={this.clickTemplate.bind(this, templates[key+1])}/>
                <div className="is-installed-container"><span className={templates[key+1] !== undefined && templates[key+1].is_installed == true ? 'is-installed' : 'hidden'}></span></div>
              </a>
            </div>
            <div className={templates[key+2] !== undefined ? 'col-sm-3' : 'hidden'}>
              <a className={templates[key+2] !== undefined && this.state.active == templates[key+2].template ? 'carousel-active thumbnail' : 'thumbnail'} >
                <img src={templates[key+2] !== undefined ? templates[key+2].logo : ''} alt="Image" className="img-responsive" onClick={this.clickTemplate.bind(this, templates[key+2])}/>
                <div className="is-installed-container"><span className={templates[key+2] !== undefined && templates[key+2].is_installed == true ? 'is-installed' : 'hidden'}></span></div>
              </a>
            </div>
            <div className={templates[key+3] !== undefined ? 'col-sm-3' : 'hidden'}>
              <a className={templates[key+3] !== undefined && this.state.active == templates[key+3].template ? 'carousel-active thumbnail' : 'thumbnail'} >
                <img src={templates[key+3] !== undefined ? templates[key+3].logo : ''} alt="Image" className="img-responsive" onClick={this.clickTemplate.bind(this, templates[key+3])}/>
                <div className="is-installed-container"><span className={templates[key+3] !== undefined && templates[key+3].is_installed == true ? 'is-installed' : 'hidden'}></span></div>
              </a>
            </div>
          </div>
          </CarouselItem>
        );
      }
    }

    return (
      <div>
        <Carousel data-interval="false" activeIndex={this.state.index} direction={this.state.direction} onSelect={this.handleSelect}>
          {rows}
        </Carousel>
      </div>
    );
  },
});

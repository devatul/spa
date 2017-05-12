var React           = require('react');
var ClipboardButton = require('react-clipboard.js');

class OneLiner extends React.Component {
  constructor(props) {
    super(props);
    this.clickToken = this.clickToken.bind(this);
  }

  clickToken() {
    this.props.clickToken();
  }

  render() {

    return (
      <div className="input-group">
        <input onClick={this.clickToken} type="text" className="form-control" aria-describedby="basic-addon1" value={this.props.text} />
        <span className="clipboard-span input-group-addon" id="basic-addon1"><ClipboardButton onClick={this.clickToken} className="clipboard-button" data-clipboard-text={this.props.text}><img className="clippy" src="./images/clippy.png" width="17" alt="Copy to clipboard" /></ClipboardButton></span>
      </div>
    );
  }
}

module.exports = OneLiner;

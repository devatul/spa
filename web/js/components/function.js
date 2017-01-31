
module.exports = {
  getCloudInputField: function (credetials) {
    var input = [];
    input.push(
      <div className="form-group">
        <div className="input-group">
          <span className="input-group-addon"><i className="fa fa-cloud fa" aria-hidden="true"></i></span>
          <input type="text" className="form-control" placeholder="Integration Name"/>
        </div>
      </div>
    );
    if (credetials["api-key"]) {
      input.push(
        <div className="form-group">
          <div className="input-group">
            <span className="input-group-addon"><i className="fa fa-key fa" aria-hidden="true"></i></span>
            <input type="text" className="form-control" placeholder="API Key"/>
          </div>
        </div>
      );
    }
    if (credetials.endpoint) {
      input.push(
        <div className="form-group">
          <div className="input-group">
            <span className="input-group-addon"><i className="fa fa-user fa" aria-hidden="true"></i></span>
            <input type="text" className="form-control" placeholder="Access Key ID"/>
          </div>
        </div>
      );
    }
    if (credetials["api-secret"]) {
      input.push(
        <div className="form-group">
          <div className="input-group">
            <span className="input-group-addon"><i className="fa fa-lock fa" aria-hidden="true"></i></span>
            <input type="text" className="form-control" placeholder="Secret Access Key"/>
          </div>
        </div>
      );
    }
    if (credetials.certificate) {
      input.push(
        <div className="input-group image-preview">
            <input type="text" className="form-control image-preview-filename" />
            <span className="input-group-btn">
                <button type="button" className="btn btn-default image-preview-clear" style={{display:'none'}}>
                    <span className="glyphicon glyphicon-remove"></span> Clear
                </button>
                <div className="btn btn-default image-preview-input">
                    <span className="glyphicon glyphicon-folder-open"></span>
                    <span className="image-preview-input-title">Choose File</span>
                    <input type="file" name="input-file-preview"/>
                </div>
            </span>
        </div>
      );
    }
    return (
      <div style={{paddingTop: '10px'}}>
        {input}
      </div>
    );
  },
};

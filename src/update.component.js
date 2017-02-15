import React from 'react';
import './App.css';

export class UpdateDocuments extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      matchPattern: '{"field-name": "value"}',
      changePattern: '{"$set":{"mongopopComment": "MongoPop has been here"}, "$inc":{"mongopopCounter": 1}}',
      threads: 1,
      numDocsUpdated: null,
      errorText: null
    }

    this.handleMatchPatternChange=this.handleMatchPatternChange.bind(this);
    this.handleChangePatternChange=this.handleChangePatternChange.bind(this);
    this.handleThreadsChange=this.handleThreadsChange.bind(this);
    this.handleUpdateSubmit=this.handleUpdateSubmit.bind(this);
  }

  componentDidMount() {
  }

  handleMatchPatternChange(event) {
    this.setState({matchPattern: event.target.value});
  }

  handleChangePatternChange(event) {
    this.setState({changePattern: event.target.value})
  }

  handleThreadsChange(event) {
    this.setState({threads: event.target.value})
  }

  handleUpdateSubmit(event) {
    let _this = this;
    this.setState({
      numDocsUpdated: null,
      erorText: null});

    this.props.dataService.sendUpdateDocs(this.props.collection, this.state.matchPattern, this.state.changePattern, this.state.threads)
    .then (
      function(results) {
        _this.setState({numDocsUpdated: results});
      },
      function(err) {
        _this.setState({errorText: err});
      })
  }

  render() {
    return (
      this.props.dataToPlayWith ? (
        <div>
          <h2>Update documents in {this.props.collection}</h2>
          <div>
            <label>
              Document pattern to match:  
              <input type="text" size="100"
                value={this.state.matchPattern}
                onChange={this.handleMatchPatternChange}
              />
            </label>
            <br/><br/>          <label>
              Change to apply to each document:  
              <input type="text" size="80"
                value={this.state.changePattern}
                onChange={this.handleChangePatternChange}
              />
            </label>
            <br/><br/>
            <label>
              How many times should this be run (concurrently)?:   
              <input type="number" min="1" max="80"
                value={this.state.threads}
                onChange={this.handleThreadsChange}
              />
            </label>
            <br/>
            <br/>
            <button onClick={this.handleUpdateSubmit}>
              {"Update " + this.props.collection}
            </button>
            <br/><br/>
            <span className="successMessage">
              {(this.state.numDocsUpdated) ? ("Updated " + this.state.numDocsUpdated.toLocaleString() + " documents in the '" + this.props.collection + "'' collection.") : ""}
            </span>
            <span className="errorMessage">
              {(this.state.errorText) ? this.state.errorText : ""}
            </span>
          </div>
        </div>
      ) : null
    );
  }
}
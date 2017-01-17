import React from 'react';
import './App.css';

export class AddDocuments extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      MockarooURL: "http://www.mockaroo.com/536ecbc0/download?count=1000&key=48da1ee0",
      numDocsToAdd: 1,
      uniqueDocs: false,
      numDocsAdded: null,
      errorText: null
    }

    this.handleURLChange=this.handleURLChange.bind(this);
    this.handleNumDocsToAddChange=this.handleNumDocsToAddChange.bind(this);
    this.handleUniqueToggle=this.handleUniqueToggle.bind(this);
    this.handleAddSubmit=this.handleAddSubmit.bind(this);
  }

  componentDidMount() {
  }

  handleURLChange(event) {
    this.setState({MockarooURL: event.target.value});
  }

  handleNumDocsToAddChange(event) {
    this.setState({numDocsToAdd: event.target.value})
  }

  handleUniqueToggle(event) {
    this.setState({uniqueDocs: event.target.checked})
  }

  handleAddSubmit(event) {
    let _this = this;
    this.setState({
      numDocsAdded: null,
      erorText:     null});

    this.props.dataService.sendAddDocs(this.props.collection, this.state.MockarooURL, this.state.numDocsToAdd, this.state.uniqueDocs)
    .then (
      function(results) {
        _this.setState({numDocsAdded: results * 1000});
      },
      function(err) {
        _this.setState({errorText: err});
      })
  }

  render() {
    return (
      <div>
        <h2>Add documents to {this.props.collection}</h2>
        <div>
          <label>
            URL to Fetch Document Array: 
            <input type="text" size="50"
              value={this.state.MockarooURL}
              onChange={this.handleURLChange}
            />
          </label>
          <br/><br/>
          <label>
            1,000s of Documents to Add:  
            <input type="number" min="1" max="1000"
              value={this.state.numDocsToAdd}
              onChange={this.handleNumDocsToAddChange}
            />
          </label>
          <br/>
          <label>
            Docs should be unique?  
            <input type="checkbox"
              checked={this.state.uniqueDocs}
              onChange={this.handleUniqueToggle}
            />
          </label>
          <br/>
          {(this.state.uniqueDocs) ? <span className="warningMessage">WARNING: Requiring all documents to be unique will slow things down</span> : ""
          }
          <br/>
          <button onClick={this.handleAddSubmit}>
            {"Add " + this.state.numDocsToAdd + ",000 documents to " + this.props.collection}
          </button>
          <br/><br/>
          <span className="successMessage">
            {(this.state.numDocsAdded) ? ("Added " + this.state.numDocsAdded.toLocaleString() + " documents to '" + this.props.collection + "'' collection.") : ""}
          </span>
          <span className="errorMessage">
            {(this.state.errorText) ? this.state.errorText : ""}
          </span>
        </div>
      </div>
    );
  }
}
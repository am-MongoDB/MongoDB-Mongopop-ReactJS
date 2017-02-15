import React from 'react';
import './App.css';

export class SampleDocuments extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      numDocsToSample: 1,
      documents: null,
      errorText: null
    }

    this.handleNumDocsToSampleChange=this.handleNumDocsToSampleChange.bind(this);
    this.handleSampleSubmit=this.handleSampleSubmit.bind(this);
  }

  componentDidMount() {
  }

  handleNumDocsToSampleChange(event) {
    this.setState({numDocsToSample: event.target.value})
  }

  handleSampleSubmit(event) {
    let _this = this;

    this.setState({
      documents: null,
      erorText:  null});

    this.props.dataService.sendSampleDocs(this.props.collection, this.state.numDocsToSample)
    .then (
      function(results) {
        _this.setState({documents: JSON.stringify(results, null, `\t`)});
        _this.props.onDataToWorkWith(true);
      },
      function(err) {
        _this.setState({errorText: err});
        _this.props.onDataToWorkWith(false);
      })
  }

  render() {
    return (
      <div>
        <h2>Sample documents from {this.props.collection}</h2>
        <div>
          <label>
            Number of documents to sample:  
            <input type="number" min="1" max="100"
              value={this.state.numDocsToSample}
              onChange={this.handleNumDocsToSampleChange}
            />
          </label>
          <br/><br/>
          <button onClick={this.handleSampleSubmit}>
            {"Sample " + this.state.numDocsToSample + (" document from " : " documents from ") + this.props.collection}
          </button>
          <br/><br/>
          <span className="json">
          <pre>{(this.state.documents) ? this.state.documents : ""}</pre>
          </span>
          <span className="errorMessage">
            {(this.state.errorText) ? this.state.errorText : ""}
          </span>
        </div>
      </div>
    );
  }
}
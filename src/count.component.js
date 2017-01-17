import React from 'react';
import './App.css';

export class CountDocuments extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      documentCount: null,
      errorText: null
    }

    this.handleCountSubmit=this.handleCountSubmit.bind(this);
  }

  componentDidMount() {
  }

  handleCountSubmit(event) {
    let _this = this;
    this.setState({
      documentCount: null,
      erorText: null});

    this.props.dataService.sendCountDocs(this.props.collection)
    .then (
      function(results) {
        _this.setState({documentCount: results});
      },
      function(err) {
        _this.setState({errorText: err});
      })
    
  }

  render() {
    return (
      <div>
        <h2>Count Documents from {this.props.collection}</h2>
        <div>
          <button onClick={this.handleCountSubmit}>
            {"Count docs in " + this.props.collection}
          </button>
          <br/><br/>
          <span className="successMessage">
            {(this.state.documentCount) ? ("Collection '" + this.props.collection + "' contains " + this.state.documentCount.toLocaleString() + " documents") : ""}
          </span>
          <span className="errorMessage">
            {(this.state.errorText) ? this.state.errorText : ""}
          </span>
        </div>
      </div>
    );
  }
}
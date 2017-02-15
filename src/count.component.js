import React from 'react';
import './App.css';

export class CountDocuments extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      documentCount: null,
      repeat: false,
      errorText: null,
      countedCollection: ""
    }

    this.handleCountSubmit=this.handleCountSubmit.bind(this);
    this.handleRepeatToggle=this.handleRepeatToggle.bind(this);
    this.countOnce=this.countOnce.bind(this);
  }

  componentDidMount() {
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  handleRepeatToggle(event) {
    this.setState({repeat: event.target.checked});
    if (!event.target.checked) {
      clearInterval(this.timerID);
      this.setState({documentCount: this.state.documentCount.toLocaleString() + " document – Stopped counting"});
    }
  }

  countOnce() {
    let _this = this;
    this.props.dataService.sendCountDocs(this.props.collection)
    .then (
      function(results) {
        _this.setState({documentCount: results});
        _this.setState({errorText: ""});
        _this.setState({countedCollection: _this.props.collection});
      },
      function(err) {
        _this.setState({errorText: err});
        _this.setState({documentCount: ""});
      })
  }

  handleCountSubmit(event) {
    let _this = this;
    clearInterval(this.timerID);
    this.setState({
      documentCount: null,
      errorText: null});

    this.props.dataService.sendCountDocs(this.props.collection)
    .then (
      function(results) {
        _this.setState({documentCount: results});
        _this.setState({countedCollection: _this.props.collection});
      },
      function(err) {
        clearInterval(_this.timerID);
        _this.setState({errorText: err});
      })
    if (this.state.repeat) {
      this.timerID = setInterval(
        () => this.countOnce(),
        5000
      );      
    }
  }

  render() {
    return (
      <div>
        <h2>Count Documents from {this.props.collection}</h2>
        <div>
          <label>
            Repeat count every 5 seconds?  
            <input type="checkbox"
              checked={this.state.repeat}
              onChange={this.handleRepeatToggle}
            />
          </label>
          <br/><br/>
          <button onClick={this.handleCountSubmit}>
            {"Count docs in " + this.props.collection}
          </button>
          <br/><br/>
          <span className="successMessage">
            {(this.state.documentCount) ? ("Collection '" + this.state.countedCollection + "' contains " + this.state.documentCount.toLocaleString() + " documents") : ""}
          </span>
          <span className="errorMessage">
            {(this.state.errorText) ? this.state.errorText : ""}
          </span>
        </div>
      </div>
    );
  }
}
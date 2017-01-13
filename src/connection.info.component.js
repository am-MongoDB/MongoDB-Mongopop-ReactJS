import React from 'react';
import './App.css';

export class ConnectionInfo extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      needCredentials: false,
      showPassword: false
    }

    this.dBInputs = this.props.connectionData.dBInputs;

    this.handleBaseURIChange=this.handleBaseURIChange.bind(this);
    this.handleDatabaseNameChange=this.handleDatabaseNameChange.bind(this);
    this.handleUsernameChange=this.handleUsernameChange.bind(this);
    this.handlePasswordChange=this.handlePasswordChange.bind(this);
    this.handlePasswordToggle=this.handlePasswordToggle.bind(this);
  }

  componentDidMount() {
    this.props.onChange(this.dBInputs);
  }

  handleBaseURIChange(event) {
    this.dBInputs.MongoDBBaseURI = event.target.value;
    this.props.onChange(this.dBInputs);
    this.setState({needCredentials: true});
  }

  handleDatabaseNameChange(event) {
    this.dBInputs.MongoDBDatabaseName = event.target.value;
    this.props.onChange(this.dBInputs);
  }  

  handleUsernameChange(event) {
    this.dBInputs.MongoDBUser = event.target.value;
    this.props.onChange(this.dBInputs);
  }

  handlePasswordChange(event) {
    this.dBInputs.MongoDBUserPassword = event.target.value;
    this.props.onChange(this.dBInputs);
  }

  handlePasswordToggle(event) {
    console.log ("Password toggle; event data = " + event.target.checked);
    this.setState({showPassword: event.target.checked});
  }

  render() {

    const needCredentials = this.state.needCredentials;
    let Credentials = null;

    if (needCredentials) {
      Credentials = (
        <div>
          <label>
            MongoDB user password for {this.dBInputs.MongoDBUser}:  
            <input type="password" size="20"
              value={this.dBInputs.MongoDBUserPassword}
              onChange={this.handlePasswordChange}
            />
          </label>
          <br/><br/>
          <label>
            Show plaintext password in URI?
            <input type="checkbox" 
              value={this.state.showPassword}
              onChange={this.handlePasswordToggle}
            />
          </label>
        </div>
        )
      };

    return (
      <div>
        <h2>MongoDB Connection Info</h2>
        <label>
          Connect String (e.g. as provided by MongoDB Atlas): 
          <input type="text" size="50"
            value={this.dBInputs.MongoDBBaseURI}
            onChange={this.handleBaseURIChange}
          />
        </label>
        <br/><br/>
        <label>
            Preferred database name: 
          <input type="text" size="20"
            value={this.dBInputs.MongoDBDatabaseName}
            onChange={this.handleDatabaseNameChange}
          />
        </label>
        <br/><br/>
        {Credentials}
        <p>
          MongoDB URI: {this.state.showPassword 
              ? this.props.connectionData.dBURI.MongoDBURI
              : this.props.connectionData.dBURI.MongoDBURIRedacted}
        </p>
      </div>
    );
  }
}
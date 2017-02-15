import React from 'react';
import './App.css';

export class ConnectionInfo extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      MongoDBBaseURI: "",
      MongoDBDatabaseName: "",
      MongoDBUser: "",
      needCredentials: false,
      showPassword: false,
      MongoDBURI: "",
      MongoDBURIRedacted: ""
    }

    this.MongoDBUserPassword = "";

    //this = this.props.connectionData;

    this.componentDidMount=this.componentDidMount.bind(this);
    this.handleBaseURIChange=this.handleBaseURIChange.bind(this);
    this.handleDatabaseNameChange=this.handleDatabaseNameChange.bind(this);
    this.handlePasswordChange=this.handlePasswordChange.bind(this);
    this.handlePasswordToggle=this.handlePasswordToggle.bind(this);
  }

  componentDidMount() {

  /* Fetch default client config information from the back-end. Expect to 
    receive:

      {
          mongodb: {
              defaultDatabase: string;
              defaultCollection: string;
              defaultUri: string;
          };
          mockarooUrl: string;
        }
    */

    let _this = this;

    this.props.dataService.fetchConfig ()
    .then(
        function(results) {
          _this.setState({MongoDBBaseURI: results.mongodb.defaultUri}, 
            () => {
            _this.setState({MongoDBDatabaseName: results.mongodb.defaultDatabase},
              () => {
                _this.handleConnectionChange();
              });
            });
        },
        function(err) {
          console.log ("fetchConfig: Hit problem: " + err);
        }
      )
  }

  handleBaseURIChange(event) {
    this.setState({MongoDBBaseURI: event.target.value}, 
      () => {
        this.setState({needCredentials: true},
          () => {
            this.handleConnectionChange();
          });
      });
  }

  handleDatabaseNameChange(event) {
    this.setState({MongoDBDatabaseName: event.target.value},
      () => {
        this.handleConnectionChange();
      });
  }  

  handlePasswordChange(event) {
    this.MongoDBUserPassword = event.target.value;
    this.handleConnectionChange();
  }

  handlePasswordToggle(event) {
    this.setState({showPassword: event.target.checked});
  }

  handleConnectionChange() {

    var dBInputs = {
      MongoDBBaseURI: this.state.MongoDBBaseURI,
      MongoDBDatabaseName: this.state.MongoDBDatabaseName,
      MongoDBUser: this.state.MongoDBUser,
      MongoDBUserPassword: this.MongoDBUserPassword
    }

    const dBURI = this.props.dataService.calculateMongoDBURI(dBInputs);
    this.setState({MongoDBURI: dBURI.MongoDBURI});
    this.setState({MongoDBURIRedacted: dBURI.MongoDBURIRedacted});
    this.setState({MongoDBUser: dBInputs.MongoDBUser});
  }

  render() {

    const needCredentials = this.state.needCredentials;
    let Credentials = null;

    if (needCredentials) {
      Credentials = (
        <div>
          <label>
            MongoDB user password for {this.state.MongoDBUser}:  
            <input type="password" size="20"
              value={this.MongoDBUserPassword}
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
            value={this.state.MongoDBBaseURI}
            onChange={this.handleBaseURIChange}
          />
        </label>
        <br/><br/>
        <label>
            Database name: 
          <input type="text" size="20"
            value={this.state.MongoDBDatabaseName}
            onChange={this.handleDatabaseNameChange}
          />
        </label>
        <br/><br/>
        {Credentials}
        <p>
          MongoDB URI: {this.state.showPassword 
              ? this.state.MongoDBURI
              : this.state.MongoDBURIRedacted}
        </p>
      </div>
    );
  }
}
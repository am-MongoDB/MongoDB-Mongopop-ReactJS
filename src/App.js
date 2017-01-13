import React, { Component } from 'react';
import './App.css';
import { DataService } from './data.service';
import { ServerDetails } from './server.details.component';
import { ConnectionInfo } from './connection.info.component';

class MongoPopContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      connectionData: {
        dBURI: {
          MongoDBURI: "", 
          MongoDBURIRedacted: ""
        },
        dBInputs: {
          MongoDBBaseURI: "mongodb://localhost:27017",
          MongoDBDatabaseName: "mongopop",
          MongoDBUser: "",
          MongoDBUserPassword: ""
        }     
      },
      MongoDBCollectionName: "simples"
    };

    this.DataToPlayWith = false;
    this.dataService = new DataService("http://localhost:3000/pop");

    this.handleConnectionChange=this.handleConnectionChange.bind(this);
  }

  handleConnectionChange(dBInputs) {

    console.log("Handling connection change; dbInputs parameter = " + JSON.stringify(dBInputs));

    const dBURI = this.dataService.calculateMongoDBURI(dBInputs);
    const connectionData = {
      dBURI: dBURI,
      dBInputs: dBInputs
    }

    console.log("New connection data: " + JSON.stringify(connectionData));

    this.setState({connectionData: connectionData});

    console.log("Updated state to " + JSON.stringify(this.state));
  }

  render() {

    return (
      <div>
      <h1>Welcom to MongoPop</h1>
        <ServerDetails
          dataService={this.dataService}
          />
        <ConnectionInfo
          connectionData={this.state.connectionData}
          onChange={this.handleConnectionChange}
        />
      </div>
    );
  }
}

class App extends Component {
  
  render() {
    return (
      <MongoPopContainer />
      )
  }
}

export default App;
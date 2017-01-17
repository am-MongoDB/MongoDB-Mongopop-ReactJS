import React, { Component } from 'react';
import './App.css';
import { DataService } from './data.service';
import { ServerDetails } from './server.details.component';
import { ConnectionInfo } from './connection.info.component';
import { CollectionName } from './collection.name.component';
import { CountDocuments } from './count.component';
import { AddDocuments } from './add.component';
import { UpdateDocuments } from './update.component';
import { SampleDocuments } from './sample.component';

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

    this.dataToPlayWith = false;
    this.dataService = new DataService("http://localhost:3000/pop");

    this.handleConnectionChange=this.handleConnectionChange.bind(this);
    this.handleCollectionChange=this.handleCollectionChange.bind(this);
    this.handleDataAvailabiltyChange=this.handleDataAvailabiltyChange.bind(this);
    this.maybeUpdateDocuments=this.maybeUpdateDocuments.bind(this);

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

  handleCollectionChange(collection) {
    this.setState({MongoDBCollectionName: collection});
  }

  handleDataAvailabiltyChange(dataAvailable) {
    this.DataToPlayWith = dataAvailable;
  }

  maybeUpdateDocuments() {
    if (this.dataToPlayWith) {
      return (
        <UpdateDocuments
          dataService={this.dataService}
          collection={this.state.MongoDBCollectionName}
        />
      )
    } else {
      return {}
    }
  }

  render() {

    return (
      <div>
      <h1>Welcome to MongoPop</h1>
        <ServerDetails
          dataService={this.dataService}
        />
        <ConnectionInfo
          connectionData={this.state.connectionData}
          onChange={this.handleConnectionChange}
        />
        <CollectionName
          database={this.state.connectionData.dBInputs.MongoDBDatabaseName}
          collection={this.state.MongoDBCollectionName}
          onChange={this.handleCollectionChange}
        />
        <AddDocuments
          dataService={this.dataService}
          collection={this.state.MongoDBCollectionName}
        />
        <CountDocuments
          dataService={this.dataService}
          collection={this.state.MongoDBCollectionName}
        />
        <maybeUpdateDocuments/>
        <SampleDocuments
          dataService={this.dataService}
          collection={this.state.MongoDBCollectionName}
          onDataToWorkWith={this.handleDataAvailabiltyChange}
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
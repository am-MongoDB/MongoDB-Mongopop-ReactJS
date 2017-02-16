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
      MongoDBCollectionName: "simples",
      DataToPlayWith: false
    };

    this.dataService = new DataService("http://localhost:3000/pop");

    this.handleCollectionChange=this.handleCollectionChange.bind(this);
    this.handleDataAvailabiltyChange=this.handleDataAvailabiltyChange.bind(this);

  }

  componentDidMount() {
  }

  handleCollectionChange(collection) {
    this.setState({MongoDBCollectionName: collection});
  }

  handleDataAvailabiltyChange(dataAvailable) {
    this.setState({DataToPlayWith: dataAvailable});
  }

  render() {

    return (
      <div>
      <h1>Welcome to MongoPop</h1>
        <ServerDetails
          dataService={this.dataService}
        />
        <ConnectionInfo
          dataService={this.dataService}
        />
        <CollectionName
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
        <UpdateDocuments
          dataService={this.dataService}
          collection={this.state.MongoDBCollectionName}
          dataToPlayWith={this.state.DataToPlayWith}
        />
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
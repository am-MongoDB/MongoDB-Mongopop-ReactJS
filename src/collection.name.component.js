import React from 'react';
import './App.css';

export class CollectionName extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      collection: ""
    }

    this.handleCollectionNameChange=this.handleCollectionNameChange.bind(this);
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
          _this.setState({collection: results.mongodb.defaultCollection}, 
            () => {
            _this.props.onChange(_this.state.collection);
            });
        },
        function(err) {
          console.log ("fetchConfig: Hit problem: " + err);
        }
      )
  }

  handleCollectionNameChange(event) {
    this.setState({collection: event.target.value});
    this.props.onChange(event.target.value);
  }

  render() {
    return (
      <div>
        <h2>Collection</h2>
        <label>
          Choose the collection: 
          <input type="text" size="20"
            value={this.state.collection}
            onChange={this.handleCollectionNameChange}
          />
        </label>
      </div>
    );
  }
}
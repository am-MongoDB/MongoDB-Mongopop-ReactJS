import React from 'react';
import './App.css';

export class CollectionName extends React.Component {

  constructor(props) {
    super(props);

    this.handleCollectionNameChange=this.handleCollectionNameChange.bind(this);
  }

  componentDidMount() {
  }

  handleCollectionNameChange(event) {
    this.props.onChange(event.target.value);
  }

  render() {
    return (
      <div>
        <h2>Collection</h2>
        <label>
          Choose the collection from the {this.props.database} database: 
          <input type="text" size="20"
            value={this.props.collection}
            onChange={this.handleCollectionNameChange}
          />
        </label>
      </div>
    );
  }
}
import React from 'react';

export class ServerDetails extends React.Component {
  constructor(props) {
    super(props);

    this.state = {serverIP: ""};

    this.componentDidMount = this.componentDidMount.bind(this);
  }

  componentDidMount() {
    let _this = this;

    this.props.dataService.fetchServerIP ()
    .then(
        function(results) {
          _this.setState({serverIP: results});
      },
        function(err) {
          _this.setState({serverIP: "Hit problem: " + err});
        }
      )
  }

  render() {
    return(
      <div>
        <h2>Server Details</h2>
        <p>The IP address of the server running MongoPop is <strong>{this.state.serverIP}</strong>, if using <a href="https://cloud.mongodb.com/" name="MongoDB Atlas – MongoDB as a service" target="_blank">MongoDB Atlas</a>, please make sure you've added this to your IP Whitelist unless you have VPC peering configured.</p>
      </div>
    )
  }
}

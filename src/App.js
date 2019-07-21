import './App.css';
import React from 'react';

import awsconfig from './aws-exports';
import Amplify, { API } from 'aws-amplify';
import { withAuthenticator } from "aws-amplify-react";

Amplify.configure(awsconfig);


let apiName = 'cpappapi';
let approvals = '/getapprovals';
let sendapproval = '/signal';

class App extends React.Component {

    constructor(props) {
      super(props);
      this.handleApprove = this.handleApprove.bind(this);
      this.handleDeny = this.handleDeny.bind(this);
      this.state = {
        resultHtml: "",
        eventsSent: 0
      };
    }
  
    componentDidMount(){
      API.get(apiName, approvals).then(response => {
              var table = [];
              var children = [];
              console.log(response)
              for(let i = 0; i < response.length; i++){
                var execid = response[i].AutomationExecutionId;
                children.push(<div id={execid} ><tr><td>{execid}</td><td><button value={execid} onClick={ this.handleApprove }> Approve </button></td><td><button value={execid} onClick={ this.handleDeny }> Deny </button></td></tr></div>)
              }
              table.push(<td>{children}</td>)
              this.setState({
                  resultHtml: table,
              });
      });
    }
  
    handleApprove(event) {
      let payload = {body:{id: event.target.value,decision: "Approve"}}
      API.post(apiName, sendapproval, payload).then(response => {
          console.log(response)
      }).catch(error => {
          console.log(error.response)
      });
      var el = document.getElementById(event.target.value);
      el.remove();
    }
    
    handleDeny(event) {
      let payload = {body:{id: event.target.value,decision: "Reject"}}
      API.post(apiName, sendapproval, payload).then(response => {
          console.log(response)
      }).catch(error => {
          console.log(error.response)
      });
      var el = document.getElementById(event.target.value);
      el.remove();
    }
    
    render() {
      return (
        <div className="App">
            <div>
              <img src="https://aws-amplify.github.io/images/layout/logo.png" alt="logo"/>
              <h1>Amplify Framework Demo</h1>
              <center>
              <table>
                {this.state.resultHtml}
              </table>
              </center>
            </div>
        </div>
      );
  }
  
  
}

// export default App
export default withAuthenticator(App , true);

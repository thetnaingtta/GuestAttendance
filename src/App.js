import React, { Component } from "react";
import { Redirect, Route, Switch } from "react-router-dom";

import GuestCheckIn from "./components/GuestCheckIn";
import "./App.css";
import GuestToTag from "./components/GuestToTag";
import CheckedInGuests from "./components/CheckedInGuests";
import NavBar from "./components/Layout/NavBar";

class App extends Component {   
  render() {
    return (
      <React.Fragment>
        <NavBar />      
        <main className="container" style={{ marginTop: "25px" }}>
        
        <Switch>
          <Route path="/GuestCheckin" component={GuestCheckIn} />
          <Route path="/GuestToTag" component={GuestToTag} />
          <Route path="/CheckedInGuests" component={CheckedInGuests} />
          <Redirect from="/" exact to="/GuestCheckin" />
          <Redirect to="/not-found" />
        </Switch>
        </main>
      </React.Fragment>
    );
  }
  
}

export default App;

import React, { Component } from "react";
import guestAPI from "../services/guestAPI.mjs";
import DateClass from "./utils/FormatDateTime";

import GuestsTable from "./GuestTables.jsx";
import SearchForm from "./SearchForm/SearchForm.jsx";

class GuestCheckIn extends Component {
  state = {
    guests: [],
  };
  
  handleSearch = async (searchname) => {
    if (!searchname) {
      this.setState({ guests: [] });
      return;
    }

    const searchedguests = (await guestAPI.getGuests()).filter((guest) =>
      guest.name.toLowerCase().includes(searchname.toLowerCase())
    );
    this.setState({ guests: searchedguests });
  };

  handleCheckIn = async (guest) => {
    const shouldCheckIn = window.confirm(
      `Are you sure to check in for ${guest.name} now?`
    );
    if (!shouldCheckIn) {
      return;
    }

    guest.checkin = DateClass.getCurrentDatetimeISO();
    const updatedguest = await guestAPI.updateGuest(guest);

    if (updatedguest === "Error updating data") {
      window.alert(`Checking in failed for ${guest.name}, please try again!`);
    } else {
      const updatedguests = [...this.state.guests];
      const index = updatedguests.indexOf(guest);
      updatedguests[index] = updatedguest;
      this.setState({ guests: updatedguests });
    }
    console.log(guest);
  };

  handleTag = async (guest) => {
    const shouldTag = window.confirm(
      `Are you sure to give Tag for ${guest.name} now?`
    );
    if (!shouldTag) {
      return;
    }

    const currentDatetime = DateClass.getCurrentDatetimeISO();
    const tagtime = DateClass.formatTime(currentDatetime);
    guest.tag = guest.tag ? "" : "Tag on " + tagtime;
    const updatedguest = await guestAPI.updateGuest(guest);

    if (updatedguest === "Error updating data") {
      window.alert(`Checking in failed for ${guest.name}, please try again!`);
    } else {
      const updatedguests = [...this.state.guests];
      const index = updatedguests.indexOf(guest);
      updatedguests[index] = updatedguest;
      this.setState({ guests: updatedguests });
    }
  };

  render() {
    const { length: count } = this.state.guests;

    return (
      <React.Fragment>
        <SearchForm onSearch={this.handleSearch} label="Name" />
        {count === 0 ? (
          <p>No matching guests found.</p>
        ) : (
          <p>Showing {count} matching guests.</p>
        )}
        <GuestsTable
          guests={this.state.guests}
          handleCheckIn={this.handleCheckIn}
          handleTag={this.handleTag}
        />
      </React.Fragment>
    );
  }
}

export default GuestCheckIn;

import React, { Component } from "react";
import guestAPI from "../services/guestAPI.mjs";
import DateClass from "./utils/FormatDateTime";

import GuestsTable from "./GuestTables.jsx";

async function fetchGuestsToTag() {
  const guests = (await guestAPI.getGuests()).filter(
    (guest) => guest.checkin !== "" && guest.tag === ""
  ).sort((a, b) => new Date(b.checkin) - new Date(a.checkin));
  return guests;
}

class GuestToTag extends Component {
  state = {
    guests: [],
  };

  async componentDidMount() {
    // check if current date is within the desired date range
    const currentDate = new Date();
    const startDate = new Date(2023, 4, 19); // May 19, 2023
    const endDate = new Date(2023, 4, 21); // May 21, 2023
    const isDateInRange = currentDate >= startDate && currentDate <= endDate;

    if (isDateInRange) {
      this.interval = setInterval(async () => {
        const guests = await fetchGuestsToTag();
        this.setState({ guests });
      }, 10000);
    } else {
      const guests = await fetchGuestsToTag();
      this.setState({ guests });
    }
  }

  componentWillUnmount() {
    // clear interval when component unmounts
    clearInterval(this.interval);
  }

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
        {count === 0 ? (
          <p>No checked in guests to tag.</p>
        ) : (
          <p>Showing {count} checked in guests to tag.</p>
        )}
        <GuestsTable guests={this.state.guests} handleTag={this.handleTag} />
      </React.Fragment>
    );
  }
}

export default GuestToTag;

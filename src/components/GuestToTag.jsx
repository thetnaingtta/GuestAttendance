import React, { Component } from "react";
import guestAPI from "../services/guestAPI.mjs";
import DateClass from "./utils/FormatDateTime";

import GuestsTable from "./GuestTables.jsx";
import RefreshButton from "./buttons/RefreshButton";

async function fetchGuestsToTag() {
  const guests = (await guestAPI.getGuests())
    .filter((guest) => guest.checkin !== "" && guest.tag === "")
    .sort((a, b) => new Date(b.checkin) - new Date(a.checkin));
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

  handleRefresh = async () => {
    const guests = await fetchGuestsToTag();
    this.setState({ guests });
  };

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
      const updatedguests = [...this.state.guests].filter((g) => g.no !== guest.no);
      this.setState({ guests: updatedguests });
    }
  };

  render() {
    const { length: count } = this.state.guests;

    return (
      <React.Fragment>
        <div style={{ display: "flex", alignItems: "center" }}>
          {count === 0 ? (
            <p style={{ margin: "0" }}>No checked in guests to tag.</p>
          ) : (
            <p style={{ margin: "0" }}>
              Showing {count} checked in guests to tag.
            </p>
          )}
          <RefreshButton OnClick={this.handleRefresh} />
        </div>
        <GuestsTable guests={this.state.guests} handleTag={this.handleTag} />
      </React.Fragment>
    );
  }
}

export default GuestToTag;

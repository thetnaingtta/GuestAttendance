import React, { Component } from "react";
import PropTypes from "prop-types";
import guestAPI from "../services/guestAPI.mjs";
import DateClass from "./utils/FormatDateTime";
import GuestsTable from "./GuestTables.jsx";
import RefreshButton from "./buttons/RefreshButton";
import "../styles/GuestAttendance.css";

async function fetchGuestsToTag() {
  const guests =
    (await guestAPI.getGuests())
      ?.filter((guest) => guest.checkin && !guest.tag)
      ?.sort((a, b) => new Date(b.checkin) - new Date(a.checkin)) || [];
  return guests;
}

class GuestToTag extends Component {
  constructor(props) {
    super(props);
    this.state = { guests: [] };
  }

  checkDateInRange(startDate, endDate) {
    const currentDate = new Date();
    return currentDate >= startDate && currentDate <= endDate;
  }

  async fetchAndUpdateGuests() {
    const guests = await fetchGuestsToTag();
    this.setState({ guests });
  }

  initializeGuestFetchingWithInterval() {
    this.fetchAndUpdateGuests();
    this.interval = setInterval(this.fetchAndUpdateGuests.bind(this), 10000);
  }

  async componentDidMount() {
    const startDate = new Date(2023, 4, 19);
    const endDate = new Date(2023, 4, 21);

    if (this.checkDateInRange(startDate, endDate)) {
      this.setState({ guests: [] });
      this.initializeGuestFetchingWithInterval();
    } else {
      this.fetchAndUpdateGuests();
    }
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  handleRefresh = async () => {
    await this.fetchAndUpdateGuests();
  };

  handleTag = async (guest) => {
    const shouldTag = window.confirm(
      `Are you sure to give Tag for ${guest.name} now?`
    );
    if (!shouldTag) return;

    const currentDatetime = DateClass.getCurrentDatetimeISO();
    const tagtime = DateClass.formatTime(currentDatetime);
    const updatedGuest = {
      ...guest,
      tag: guest.tag ? "" : `Tag on ${tagtime}`,
    };

    const response = await guestAPI.updateGuest(updatedGuest);
    if (response === "Error updating data") {
      window.alert(`Tagging failed for ${guest.name}, please try again!`);
    } else {
      this.setState((prevState) => ({
        guests: prevState.guests.filter((g) => g.no !== guest.no),
      }));
    }
  };

  renderMessage() {
    const { guests } = this.state;
    if (guests === null) return <p className="message">Loading guests...</p>;
    if (guests.length === 0)
      return <p className="message">No checked in guests to tag.</p>;
    return (
      <p className="message">
        Showing {guests.length} checked in guests to tag.
      </p>
    );
  }

  renderTable() {
    const { guests } = this.state;
    if (guests.length > 0) {
      return <GuestsTable guests={guests} handleTag={this.handleTag} />;
    }
    return null;
  }

  render() {
    return (
      <React.Fragment>
        <div style={{ display: "flex", alignItems: "center" }}>
          {this.renderMessage()}
          <RefreshButton OnClick={this.handleRefresh} />
        </div>
        {this.renderTable()}
      </React.Fragment>
    );
  }
}

// PropTypes for child components
GuestsTable.propTypes = {
  guests: PropTypes.arrayOf(
    PropTypes.shape({
      no: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      company: PropTypes.string,
      country: PropTypes.string,
      checkin: PropTypes.string,
      tag: PropTypes.string,
    })
  ).isRequired,
  handleTag: PropTypes.func.isRequired,
};

RefreshButton.propTypes = {
  OnClick: PropTypes.func.isRequired,
};

export default GuestToTag;
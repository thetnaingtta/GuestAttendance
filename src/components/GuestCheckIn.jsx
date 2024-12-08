import React, { Component } from "react";
import PropTypes from "prop-types";
import guestAPI from "../services/guestAPI.mjs";
import DateClass from "./utils/FormatDateTime";
import GuestsTable from "./GuestTables.jsx";
import SearchForm from "./SearchForm/SearchForm.jsx";
import "../styles/GuestAttendance.css";

class GuestCheckIn extends Component {
  state = {
    guests: [],
    isLoading: false,
  };

  confirmAction = (message) => window.confirm(message);

  handleSearch = async (searchTerm, field) => {
    this.setState({ isLoading: true });

    if (!searchTerm) {
      this.setState({ guests: [], isLoading: false });
      return;
    }

    const searchedGuests = (await guestAPI.getGuests()).filter((guest) =>
      guest[field]?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    this.setState({ guests: searchedGuests, isLoading: false });
  };

  handleCheckIn = async (guest) => {
    const shouldCheckIn = this.confirmAction(
      `Are you sure to check in for ${guest.name} now?`
    );
    if (!shouldCheckIn) return;

    const updatedGuest = {
      ...guest,
      checkin: DateClass.getCurrentDatetimeISO(),
    };

    const response = await guestAPI.updateGuest(updatedGuest);
    if (response === "Error updating data") {
      window.alert(`Checking in failed for ${guest.name}, please try again!`);
    } else {
      this.setState((prevState) => ({
        guests: prevState.guests.map((g) =>
          g.no === updatedGuest.no ? updatedGuest : g
        ),
      }));
    }
  };

  handleTag = async (guest) => {
    const shouldTag = this.confirmAction(
      `Are you sure to give Tag for ${guest.name} now?`
    );
    if (!shouldTag) return;

    const currentDatetime = DateClass.getCurrentDatetimeISO();
    const updatedGuest = {
      ...guest,
      tag: guest.tag ? "" : `Tag on ${DateClass.formatTime(currentDatetime)}`,
    };

    const response = await guestAPI.updateGuest(updatedGuest);
    if (response === "Error updating data") {
      window.alert(`Tagging failed for ${guest.name}, please try again!`);
    } else {
      this.setState((prevState) => ({
        guests: prevState.guests.map((g) =>
          g.no === updatedGuest.no ? updatedGuest : g
        ),
      }));
    }
  };

  render() {
    const { guests, isLoading } = this.state;

    return (
      <React.Fragment>
        <div className="flex-container">
          <SearchForm
            onSearch={(term) => this.handleSearch(term, "name")}
            label="Name"
          />
          <SearchForm
            onSearch={(term) => this.handleSearch(term, "company")}
            label="Company"
          />
        </div>
        {isLoading ? (
          <p>Loading...</p>
        ) : guests.length === 0 ? (
          <p>No matching guests found.</p>
        ) : (
          <p>Showing {guests.length} matching guests.</p>
        )}
        <GuestsTable
          guests={guests}
          handleCheckIn={this.handleCheckIn}
          handleTag={this.handleTag}
        />
      </React.Fragment>
    );
  }
}

GuestsTable.propTypes = {
  guests: PropTypes.arrayOf(
    PropTypes.shape({
      no: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      company: PropTypes.string,
      checkin: PropTypes.string,
      tag: PropTypes.string,
    })
  ).isRequired,
  handleCheckIn: PropTypes.func.isRequired,
  handleTag: PropTypes.func.isRequired,
};

SearchForm.propTypes = {
  onSearch: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
};

export default GuestCheckIn;

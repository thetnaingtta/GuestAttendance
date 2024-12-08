import React, { Component } from "react";
import PropTypes from "prop-types";
import guestAPI from "../services/guestAPI.mjs";
import GuestsTable from "./GuestTables.jsx";
import SearchForm from "./SearchForm/SearchForm.jsx";
import Pagination from "./common/pagination.jsx";
import { paginate } from "./utils/paginate.js";
import RefreshButton from "./buttons/RefreshButton";
import "../styles/GuestAttendance.css";

async function fetchAllCheckInGuest() {
  const guests = (await guestAPI.getGuests())
    .filter((guest) => guest.checkin !== "")
    .sort((a, b) => new Date(b.checkin) - new Date(a.checkin));
  return guests;
}

class CheckedInGuests extends Component {
  state = {
    guests: [],
    currentPage: 1,
    pageSize: 10,
  };

  async fetchAndSetGuests() {
    const guests = await fetchAllCheckInGuest();
    this.setState({ guests });
  }

  async componentDidMount() {
    await this.fetchAndSetGuests();
  }

  handleRefresh = async () => {
    await this.fetchAndSetGuests();
    this.setState({ currentPage: 1 });
  };

  handleSearch = async (searchTerm, field) => {
    if (!searchTerm) {
      await this.fetchAndSetGuests();
      return;
    }

    const searchedGuests = this.state.guests.filter((guest) =>
      guest[field]?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    this.setState({ guests: searchedGuests });
  };

  handleTag = async (guest) => {
    console.log(guest);
    // Handle tagging logic here
  };

  handlePageChange = (page) => {
    this.setState({ currentPage: page });
  };

  getPagedata = () => {
    const { pageSize, currentPage, guests: allGuests } = this.state;

    const guests_paginate = paginate(allGuests, currentPage, pageSize);

    return { totalPageCount: allGuests.length, data: guests_paginate };
  };

  render() {
    const { pageSize, currentPage } = this.state;
    const { totalPageCount, data: pagedGuests } = this.getPagedata();

    return (
      <React.Fragment>
        <div className="flex-container">
          <SearchForm onSearch={(term) => this.handleSearch(term, "name")} label="Name" />
          <SearchForm onSearch={(term) => this.handleSearch(term, "company")} label="Company" />
        </div>

        <div className="flex-container">
          {totalPageCount === 0 ? (
            <p>No Checked In guests found.</p>
          ) : (
            <p>
              <b>Page {currentPage}:</b> Showing {pagedGuests.length} of {totalPageCount} Checked In guests.
            </p>
          )}
          <RefreshButton OnClick={this.handleRefresh} />
        </div>
        <GuestsTable
          guests={pagedGuests}
          handleCheckIn={this.handleCheckIn}
          handleTag={this.handleTag}
        />
        <Pagination
          itemsCount={totalPageCount}
          pageSize={pageSize}
          currentPage={currentPage}
          onPageChange={this.handlePageChange}
        />
      </React.Fragment>
    );
  }
}

CheckedInGuests.propTypes = {
  // Add prop validation if this component receives external props
};

// PropTypes for child components
GuestsTable.propTypes = {
  guests: PropTypes.arrayOf(
    PropTypes.shape({
      no: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      company: PropTypes.string,
      checkin: PropTypes.string.isRequired,
      tag: PropTypes.string,
    })
  ).isRequired,
  handleCheckIn: PropTypes.func,
  handleTag: PropTypes.func.isRequired,
};

SearchForm.propTypes = {
  onSearch: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
};

Pagination.propTypes = {
  itemsCount: PropTypes.number.isRequired,
  pageSize: PropTypes.number.isRequired,
  currentPage: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
};

RefreshButton.propTypes = {
  OnClick: PropTypes.func.isRequired,
};

export default CheckedInGuests;
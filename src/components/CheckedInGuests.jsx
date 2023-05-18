import React, { Component } from "react";
import guestAPI from "../services/guestAPI.mjs";

import GuestsTable from "./GuestTables.jsx";
import SearchForm from "./SearchForm/SearchForm.jsx";
import Pagination from "./common/pagination.jsx";
import { paginate } from "./utils/paginate.js";
import RefreshButton from "./buttons/RefreshButton";

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

  async componentDidMount() {
    const guests = await fetchAllCheckInGuest();
    this.setState({ guests });
  }

  handleRefresh = async () => {
    const guests = await fetchAllCheckInGuest();
    this.setState({ guests });
    this.setState({ currentPage: 1 });
  };

  handleSearchCompany = async (searchname) => {
    if (!searchname) {
      const guests = await fetchAllCheckInGuest();
      this.setState({ guests });
      return;
    }

    const searchedguests = (await fetchAllCheckInGuest()).filter((guest) =>
      guest.company.toLowerCase().includes(searchname.toLowerCase())
    );
    this.setState({ guests: searchedguests });
  };

  handleSearch = async (searchname) => {
    if (!searchname) {
      const guests = await fetchAllCheckInGuest();
      this.setState({ guests });
      return;
    }

    const searchedguests = (await fetchAllCheckInGuest()).filter((guest) =>
      guest.name.toLowerCase().includes(searchname.toLowerCase())
    );
    this.setState({ guests: searchedguests });
  };

  handleTag = async (guest) => {
    console.log(guest);
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
    const { length: count } = this.state.guests;
    const { pageSize, currentPage } = this.state;

    const { totalPageCount, data: pagedGuests } = this.getPagedata();

    return (
      <React.Fragment>
        <div style={{ display: "flex" }}>
          <SearchForm onSearch={this.handleSearch} label="Name" />
          <SearchForm onSearch={this.handleSearchCompany} label="Company" />
        </div>

        <div style={{ display: "flex", alignItems: "center" }}>
          {count === 0 ? (
            <p>No Checked In guests found.</p>
          ) : (
            <p>
              <b>Page {currentPage} :</b> Showing {count} Checked In guests.
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

export default CheckedInGuests;

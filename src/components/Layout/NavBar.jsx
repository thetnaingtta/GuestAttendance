import React from "react";
import { Link, NavLink } from "react-router-dom";
import "./NavBar.module.css";

const NavBar = () => {
  return (
    <header style={{ backgroundColor: "#8a2b06", color: "white", position: "top" }}>
      <nav>
        <ul>
          <li>
            <NavLink to="/GuestAttendance">Guest Check In</NavLink>
          </li>
          <li>
            <NavLink to="/GuestToTag">Guest Tag</NavLink>
          </li>
          <li>
            <NavLink to="/CheckedInGuests">Checked In Guests</NavLink>
          </li>
        </ul>
      </nav>
    </header>
  );
};


export default NavBar;

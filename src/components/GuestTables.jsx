import { Fragment } from "react";
import PropTypes from "prop-types";
import EventButton from "./buttons/EventButton";
import DateClass from "./utils/FormatDateTime";
import { replaceSpecialCharacters } from "./utils/stringUtility";

const GuestsTable = ({ guests, handleCheckIn, handleTag }) => {
  const renderCheckInButtonOrDate = (guest) =>
    guest.checkin ? (
      DateClass.formatDateTime(guest.checkin)
    ) : (
      <EventButton guest={guest} OnClick={handleCheckIn} label="Check In" />
    );

  const renderTagButtonOrText = (guest) =>
    guest.tag ? (
      guest.tag
    ) : guest.checkin ? (
      <EventButton guest={guest} OnClick={handleTag} label="TAG" />
    ) : (
      ""
    );

  const GuestRow = ({ guest }) => (
    <tr>
      <td>{replaceSpecialCharacters(guest.name)}</td>
      <td>{guest.company}</td>
      <td>{guest.country}</td>
      <td>{renderCheckInButtonOrDate(guest)}</td>
      <td>{renderTagButtonOrText(guest)}</td>
    </tr>
  );

  return (
    <Fragment>
      <table className="table">
        <thead>
          <tr>
            <th scope="col">Name</th>
            <th scope="col">Company</th>
            <th scope="col">Country</th>
            <th scope="col">Checked In</th>
            <th scope="col">Tag</th>
          </tr>
        </thead>
        <tbody>
          {guests.length > 0 ? (
            guests.map((guest) => <GuestRow key={guest.no} guest={guest} />)
          ) : (
            <tr>
              <td colSpan="5" style={{ textAlign: "center" }}>
                No guests available.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </Fragment>
  );
};

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
  handleCheckIn: PropTypes.func.isRequired,
  handleTag: PropTypes.func.isRequired,
};

export default GuestsTable;

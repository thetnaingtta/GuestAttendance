import { Fragment } from "react";
import EventButton from "./buttons/EventButton";
import DateClass from "./utils/FormatDateTime";

const GuestsTable = (props) => {
  const { guests, handleCheckIn, handleTag } = props;
  return (
    <Fragment>
      <table className="table">
        <thead>
          <tr>
            {/* <th>No</th> */}
            <th>Name</th>
            {/* <th>Email</th> */}
            <th>Company</th>
            <th>Country</th>
            <th>Checked In</th>
            <th>Tag</th>
          </tr>
        </thead>
        <tbody>
          {guests.map((guest) => (
            <tr key={guest.no}>
              {/* <td>{guest.no}</td> */}
              <td>{guest.name}</td>
              {/* <td>{guest.email}</td> */}
              <td>{guest.company}</td>
              <td>{guest.country}</td>
              <td>
                {guest.checkin ? (
                  DateClass.formatDateTime(guest.checkin)
                ) : (
                  <EventButton
                    guest={guest}
                    OnClick={handleCheckIn}
                    label="Check In"
                  />
                )}
              </td>
              <td>
                {guest.tag ? (
                  guest.tag
                ) : guest.checkin ? (
                  <EventButton guest={guest} OnClick={handleTag} label="TAG" />
                ) : (
                  ""
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Fragment>
  );
};

export default GuestsTable;

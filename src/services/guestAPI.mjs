import fetch from "node-fetch";

class GuestAPI {
  async getGuests() {
    const response = await fetch("https://eventattendance-2b5b7-default-rtdb.asia-southeast1.firebasedatabase.app/guests.json");
    const responseData = await response.json();

    //this line is to remove null inside the returned objects.
    const dataArray = Object.values(responseData).filter(item => item !== null);

    return dataArray;
  }

  async updateGuest(guest) {  
    try {
      const response = await fetch("https://eventattendance-2b5b7-default-rtdb.asia-southeast1.firebasedatabase.app/guests.json", {
        method: 'PATCH', // use PATCH instead of PUT to update existing data
        body: JSON.stringify({
          // specify the data you want to update
          [guest.no]: {
            no: guest.no,
            name: guest.name,
            email: guest.email,
            company: guest.company,
            country: guest.country,
            checkin: guest.checkin,
            tag: guest.tag,
          },
        }),
      });
  
      const responseData = await response.json();
      return responseData[guest.no];
    } catch (error) {
      console.error("Error updating data:", error);
      return "Error updating data";
    }
  }

}

const guestAPI = new GuestAPI();
export default guestAPI;

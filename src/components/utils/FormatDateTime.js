class DateTime {
  formatDateTime(dateValue) {
    const DateValue = new Date(dateValue);
    const formattedDate = `${DateValue.toLocaleDateString(
      "en-GB"
    )} ${DateValue.toLocaleTimeString("en-GB", {
      hour12: true,
      hour: "numeric",
      minute: "numeric",
    })}`;
    return formattedDate.toUpperCase();
  }

  formatTime(dateValue) {
    const DateValue = new Date(dateValue);
    const formattedTime = DateValue.toLocaleTimeString("en-GB", {
      hour12: true,
      hour: "numeric",
      minute: "numeric",
    });
    return formattedTime.toUpperCase();
  }

  getCurrentDatetimeISO() {
    const currentTime = new Date();
    const currentTimeISO = currentTime.toISOString();
    return currentTimeISO;
  }
}

const DateClass = new DateTime();

export default DateClass;

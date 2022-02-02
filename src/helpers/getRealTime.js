const getRealTime = (date) => {
  return new Date(Number(date))
    .toLocaleString("en-EN", {
      hour12: false,
      timeZone: "Europe/Moscow",
      hour: "numeric",
      minute: "numeric",
    })
    .replace("24", "00");
};

module.exports = { getRealTime };

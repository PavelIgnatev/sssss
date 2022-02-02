const getRealTime = (date) => {
  const subbed = new Date(date);
  const hour = subbed
    .getHours()
    .toLocaleString("en-US", {
      timeZone: "Europe/Moscow",
    })
    .toString()
    .padStart(2, "0");
  const min = subbed
    .getMinutes()
    .toLocaleString("en-US", {
      timeZone: "Europe/Moscow",
    })
    .toString()
    .padStart(2, "0");
  return `${hour}:${min}`;
};

module.exports = { getRealTime };

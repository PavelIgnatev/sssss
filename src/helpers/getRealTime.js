const getRealTime = (date) => {
  const subbed = new Date(date).toLocaleString("en-US", {
    timeZone: "Europe/Moscow",
  });
  const hour = subbed.getHours().toString().padStart(2, "0");
  const min = subbed.getMinutes().toString().padStart(2, "0");
  return `${hour}:${min}`;
};

module.exports = { getRealTime };

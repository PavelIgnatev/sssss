const startDay = (date) => {
  return new Date(Number(date)).toLocaleString("en-EN", {
    timeZone: "Europe/Moscow",
    weekday: "long",
  });
};

module.exports = { startDay };

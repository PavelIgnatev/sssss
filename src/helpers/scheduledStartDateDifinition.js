const { getDate } = require("./getDate");

const scheduledStartDateDifinition = (tournament, timezone) => {
  const isStartDate = tournament["@date"] ?? 0;
  const startDate = Number(isStartDate * 1000) + Number(timezone);
  return isStartDate ? getDate(startDate) : "-";
};

module.exports = { scheduledStartDateDifinition };

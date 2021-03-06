const { getDate } = require("./getDate");

const scheduledStartDateDifinition = (tournament) => {
  const isStartDate = tournament["@date"] ?? 0;
  const startDate = Number(isStartDate * 1000);
  return isStartDate ? getDate(startDate) : "-";
};

module.exports = { scheduledStartDateDifinition };

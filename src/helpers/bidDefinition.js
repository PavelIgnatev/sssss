const bidDefinition = (level, tournament, allGaps) => {
  let bid = tournament["@bid"];
  const network = tournament["@network"];
  const status = `${tournament["@turbo"] ? "turbo" : "normal"}`;

  const gapByBid = allGaps?.[level]?.[network]?.[status]?.[bid];
  if(network === 'GG' && bid === '25.00'){
    console.log( gapByBid, [level], [network], [status], [bid])
  }
  if (gapByBid) {
    bid = gapByBid;
  }

  return bid;
};

module.exports = { bidDefinition };

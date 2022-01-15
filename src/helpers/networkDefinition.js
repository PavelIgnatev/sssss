const networkDefinition = (network) => {
  switch (network) {
    case "PokerStars(FR-ES-PT)": {
      network = "PS.es";
      break;
    }
    case "PokerStars": {
      network = "PS.eu";
      break;
    }
    case "PartyPoker": {
      network = "Party";
      break;
    }
    case "GGNetwork": {
      network = "GG";
      break;
    }
    case "888Poker": {
      network = "888";
      break;
    }
    case "Winamax.fr": {
      network = "WNMX";
      break;
    }
  }
  return network;
};

module.exports = { networkDefinition };

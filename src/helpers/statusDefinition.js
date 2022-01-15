const statusDefinition = (tournament) => {
  const turbo = tournament["@turbo"];
  const KO = tournament["@bounty"];
  const superturbo = tournament["@flags"]?.includes("ST");
  const status = `${KO ? "KO" : "!KO"}${
    superturbo ? "SuperTurbo" : turbo ? "Turbo" : "Normal"
  }`;
  return status;
};

module.exports = { statusDefinition };

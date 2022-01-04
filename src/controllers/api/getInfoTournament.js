const { readFile } = require("../../utils/promisify");

module.exports = async (req, res) => {
  const state = JSON.parse(
    await readFile("src/state/stateByLevelWithoutSum.json")
  );
  const settings = JSON.parse(await readFile("src/state/settings.json"));

  const timezone = req.query.timezone;
  const network = req.query.network;
  const level = req.query.level;
  const currency = req.query.currency;
  const realBid = req.query.bid;
  const status = req.query.status;

  const stateAbility = JSON.parse(
    await readFile("src/state/stateByLevel.json")
  );

  res.json(
    state[timezone][network][level][currency][realBid][status].map((item) => {
      const abilityBid =
        stateAbility[timezone]?.[network]?.[level]?.[currency]?.[realBid]?.[
          status
        ];

      const step = settings[network]?.[level]?.[currency]?.[realBid]?.[
        status
      ]?.[item["@name"].toLowerCase()]
        ? settings[network]?.[level]?.[currency]?.[realBid]?.[status]?.[
            item["@name"].toLowerCase()
          ]
        : settings[network]?.[level]?.[currency]?.[realBid]?.[status]?.["all"]
        ? settings[network]?.[level]?.[currency]?.[realBid]?.[status]?.["all"]
        : 0;
      return {
        ...item,
        "@abilityBid": abilityBid
          ? Number(abilityBid) +
            Number(
              step
            )
          : "-",
        "@ability": Math.round(item["@avability"]),
      };
    })
  );
};

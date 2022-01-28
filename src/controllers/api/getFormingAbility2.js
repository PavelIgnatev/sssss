const { readFile } = require("../../utils/promisify");

module.exports = async (req, res) => {
  const state = JSON.parse(
    await readFile("src/store/ability2/formingAbility2.json")
  );
  const settings = JSON.parse(await readFile("src/store/rules/rules.json"));

  const timezone = req.query.timezone;
  const network = req.query.network;
  const level = req.query.level;
  const currency = req.query.currency;
  const realBid = req.query.bid;
  const status = req.query.status;

  const stateAbility = JSON.parse(
    await readFile("src/store/ability2/ability2WithoutName.json")
  );

  res.json(
    state[timezone][network][level][currency][realBid][status].map((item) => {
      const abilityBid =
        stateAbility[timezone]?.[network]?.[level]?.[currency]?.[realBid]?.[
          status
        ];

      const step = settings[network]?.[level]?.[currency]?.[realBid]?.[
        status
      ]?.[item["n"]]
        ? settings[network]?.[level]?.[currency]?.[realBid]?.[status]?.[
            item["n"]
          ]
        : settings[network]?.[level]?.[currency]?.[realBid]?.[status]?.["all"]
        ? settings[network]?.[level]?.[currency]?.[realBid]?.[status]?.["all"]
        : 0;

      return {
        ...item,
        "@scheduledStartDate": item["s"],
        "@duration": item["d"],
        "@guarantee": item["g"],
        "@name": item["n"],
        "@network": network,
        "@bid": item["b"],
        "@prizepool": item["p"],
        "@abilityBid": abilityBid ? Number(abilityBid) + Number(step) : "-",
        "@ability": Math.round(item["a"]),
      };
    })
  );
};

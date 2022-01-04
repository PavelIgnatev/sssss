const { readFile } = require("../../utils/promisify");

module.exports = async (req, res) => {
  //Добавить таймзоны
  
  const stateByLevel = JSON.parse(await readFile("src/state/st.json"))['0'];
  res.json(stateByLevel);
};

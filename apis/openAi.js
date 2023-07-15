const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  apiKey: process.env.OPEN_AI_API_KEY, // paid
});
const openai = new OpenAIApi(configuration);

module.exports = { openai };
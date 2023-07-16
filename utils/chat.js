const { openai } = require("../apis/openAi");

const chat = async (prompt) => {
  const chatResponse = await openai.createCompletion({
    model: "text-davinci-003",
    prompt,
    max_tokens: 1024,
    temperature: 0.8,
  });
  return chatResponse.data.choices[0].text;
};

module.exports = { chat };

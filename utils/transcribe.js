const fs = require("fs");
const { openai } = require("../apis/openAi");


const transcribe = async (filename) => {
  const transcript = await openai.createTranscription(
    fs.createReadStream(filename),
    "whisper-1"
  );
  return transcript.data.text;
};

module.exports = { transcribe };
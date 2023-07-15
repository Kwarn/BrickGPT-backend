const express = require("express");
const multer = require("multer");
const { Configuration, OpenAIApi } = require("openai");
const fs = require("fs");
const ffmpeg = require("fluent-ffmpeg");

const convertToM4A = (buffer) => {
  return new Promise((resolve, reject) => {
    const outputPath = "output.m4a";

    // Write the buffer to a temporary file
    fs.writeFileSync("input.wav", buffer);

    // Convert the WAV file to M4A format using FFmpeg
    ffmpeg("input.wav")
      .output(outputPath)
      .on("end", () => {
        // Read the converted M4A file as a buffer
        const convertedBuffer = fs.readFileSync(outputPath);

        // Delete the temporary files
        fs.unlinkSync("input.wav");
        fs.unlinkSync(outputPath);

        resolve(convertedBuffer);
      })
      .on("error", (error) => {
        reject(error);
      })
      .run();
  });
};

const router = express.Router();
const upload = multer();

const configuration = new Configuration({
  apiKey: process.env.OPEN_AI_API_KEY, // paid
});
const openai = new OpenAIApi(configuration);

async function transcribe(filename) {
  const transcript = await openai.createTranscription(
    fs.createReadStream(filename),
    "whisper-1"
  );
  return transcript.data.text;
}

router.post("/", upload.any("file"), async (req, res) => {
  try {
    const file = req.files[0];
    const buffer = file.buffer;
    buffer.name = file.originalname;

    const convertedBuffer = await convertToM4A(buffer);
    fs.writeFileSync("output.m4a", convertedBuffer);

    const response = await transcribe("output.m4a");
    res.send(response)
    console.log("Transcription:", response);
  } catch (error) {
    console.error("Error:", error);
  }
});

module.exports = router;

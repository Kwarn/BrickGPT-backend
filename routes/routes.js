const fs = require("fs");
const express = require("express");
const multer = require("multer");
const { transcribe } = require("../utils/transcribe");
const { convertToM4A } = require("../utils/fileConversion");
const { chat } = require("../utils/chat");

const router = express.Router();
const upload = multer();

router.post("/api/transcribe", upload.any("file"), async (req, res) => {
  try {
    const file = req.files[0];
    const buffer = file.buffer;
    buffer.name = file.originalname;

    const convertedBuffer = await convertToM4A(buffer);
    fs.writeFileSync("output.m4a", convertedBuffer);

    const transcript = await transcribe("output.m4a");
    console.log("Transcript: ", transcript);

    if (transcript) {
      return res.send({ transcript });
    }
  } catch (e) {
    console.error("Error:", e);
    return res.send({
      message: "failed to fetch transcription",
    });
  }
});

router.post("/api/ask", async (req, res, next) => {
  const prompt = req.body.prompt;

  try {
    const aiResponse = await chat(prompt);
    if (aiResponse) {
      return res.send({ aiResponse });
    }
  } catch (e) {
    return res.send({
      message: "failed to fetch ai response",
    });
  }
});

router.get("/api/text-to-speech", async (req, res, next) => {
  const { key, region, phrase, file } = req.query;

  if (!key || !region || !phrase) res.status(404).send("Invalid query string");

  let fileName = null;

  // stream from file or memory
  if (file && file === true) {
    fileName = `./temp/stream-from-file-${timeStamp()}.mp3`;
  }

  const audioStream = await textToSpeech(key, region, phrase, fileName);
  res.set({
    "Content-Type": "audio/mpeg",
    "Transfer-Encoding": "chunked",
  });
  audioStream.pipe(res);
});

module.exports = router;

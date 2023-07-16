const fs = require("fs");
const express = require("express");
const multer = require("multer");
const { transcribe } = require("../utils/transcribe");
const { convertToM4A } = require("../utils/fileConversion");
const { chat } = require("../utils/chat");

const router = express.Router();
const upload = multer();

router.post("/", upload.any("file"), async (req, res) => {
  try {
    const file = req.files[0];
    const buffer = file.buffer;
    buffer.name = file.originalname;

    const convertedBuffer = await convertToM4A(buffer);
    fs.writeFileSync("output.m4a", convertedBuffer);

    const transcript = await transcribe("output.m4a");
    const chatRes = await chat(transcript);
    console.log("Transcript: ", transcript);
    console.log("Chat: ", chatRes);
    if (transcript && chatRes) {
      return res.send({ transcript, chat: chatRes });
    }
    return res.send({
      message: `${!transcript && "failed to fetch transcription "}${
        !chatRes && "failed to fetch chat response"
      } `,
    });
  } catch (error) {
    console.error("Error:", error);
  }
});

router.get("/text-to-speech", async (req, res, next) => {
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

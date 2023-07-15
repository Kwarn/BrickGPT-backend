const fs = require("fs");
const express = require("express");
const multer = require("multer");
const { transcribe } = require("../utils/transcribe");
const { convertToM4A } = require("../utils/fileConversion");

const router = express.Router();
const upload = multer();

router.post("/", upload.any("file"), async (req, res) => {
  try {
    const file = req.files[0];
    const buffer = file.buffer;
    buffer.name = file.originalname;

    const convertedBuffer = await convertToM4A(buffer);
    fs.writeFileSync("output.m4a", convertedBuffer);

    const response = await transcribe("output.m4a");
    res.send(response);
    console.log("Transcription:", response);
  } catch (error) {
    console.error("Error:", error);
  }
});

module.exports = router;

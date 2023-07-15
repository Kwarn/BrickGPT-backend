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

module.exports = { convertToM4A };
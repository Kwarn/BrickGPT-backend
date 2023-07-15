require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();
app.use(express.static("public"));
app.use(express.json());
app.use(cors());

app.use("/", require("./routes/routes"));

app.use(function (err, req, res, next) {
  res.status(422).send({ error: err.message });
});
const port = process.env.PORT || 4000;
const host = process.env.HOST;
app.listen(port, function () {
  console.log(`Server running on http://${host}:${port}/`);
});

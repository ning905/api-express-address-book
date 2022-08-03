const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const app = express();
const contacts = require("./contacts.json");
const meetings = require("./meetings.json");

app.use(morgan("dev"));
app.use(cors());

app.get("/", (req, res) => {
  console.log("Got request!");
  res.json("Hello world!");
});

app.get("/contacts", (req, res) => {
  res.json(contacts);
});

const port = 4040;
app.listen(port, () => {
  console.log(`listening on port http://localhost:${port}/`);
});

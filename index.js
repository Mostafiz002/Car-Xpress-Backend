const express = require("express");
const cors = require("cors");
const app = express()
require("dotenv").config();

//middleware
app.use(express.json());
app.use(cors());

//port and clients
const port = process.env.PORT || 5000;


app.get("/", (req, res) => {
  res.send("Car Xpress server is running!");
});

app.listen(port, () => {
  console.log(`Car Xpress app listening on port ${port}`);
});
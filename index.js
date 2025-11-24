const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();
const { MongoClient, ServerApiVersion } = require("mongodb");

//middleware
app.use(express.json());
app.use(cors());

//port and clients
const port = process.env.PORT || 5000;
const uri = process.env.URI;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();

    //DB and collection
    const db = client.db("car_xpress_db");
    const carsCollection = db.collection("cars");

    //cars apis here:)

    console.log("Connected to MongoDB!");
  } catch (err) {
    console.error("MongoDB connection failed:", err.message);
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Car Xpress server is running!");
});

app.listen(port, () => {
  console.log(`Car Xpress app listening on port ${port}`);
});

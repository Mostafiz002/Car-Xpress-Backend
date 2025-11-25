const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();
const { MongoClient, ServerApiVersion } = require("mongodb");

//middleware
app.use(express.json());
app.use(cors());

//verify firebase token
const verifyFirebaseToken = async (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(401).send({ message: "unauthorized access" });
  }
  const token = req.headers.authorization.split(" ")[1];
  if (!token) {
    return res.status(401).send({ message: "unauthorized access" });
  }

  try {
    const userInfo = await admin.auth().verifyIdToken(token);
    req.token_email = userInfo.email;
    console.log("after token validation ", userInfo);
    next();
  } catch {
    return res.status(401).send({ message: "unauthorized access" });
  }
};

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

    //get all cars data from db
    app.get("/cars", async (req, res) => {
      try {
        const { limit } = req.query;

        let cursor = carsCollection.find().sort({ created_at: -1 });

        if (limit) {
          cursor = cursor.limit(parseInt(limit));
        }

        const result = await cursor.toArray();
        res.send(result);
      } catch {
        res.status(500).send({ message: "Failed to fetch cars" });
      }
    });

    //add to db
    app.post("/cars", verifyFirebaseToken, async (req, res) => {
      try {
        const car = req.body;
        const newCar = {
          ...car,
          created_at: new Date(),
        };
        const result = await carsCollection.insertOne(newCar);
        res.send(result);
      } catch {
        res.status(500).send({ message: "Failed to add car" });
      }
    });

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

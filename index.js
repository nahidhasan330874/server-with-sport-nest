const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

dotenv.config();

const uri = process.env.MONGODB_URL;

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

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

    const db = client.db("sportNest");

    const facilityCollection = db.collection("facility");
    const bookingsCollection = db.collection("bookings");
    const managesCollection = db.collection("manage-facilities");

    app.get("/add-facility", async (req, res) => {
      const result = await facilityCollection.find().toArray();
      res.send(result);
    });

    app.post("/add-facility", async (req, res) => {
      const facilityData = req.body;

      const result = await facilityCollection.insertOne(facilityData);

      res.send(result);
    });

    app.get("/facilities/:id", async (req, res) => {
      const id = req.params.id;

      const result = await facilityCollection.findOne({
        _id: new ObjectId(id),
      });

      res.send(result);
    });

    app.delete("/add-facility/:id", async (req, res) => {
      const id = req.params.id;

      const result = await facilityCollection.deleteOne({
        _id: new ObjectId(id),
      });

      res.send(result);
    });

    app.post("/bookings", async (req, res) => {
      const booking = req.body;

      const result = await bookingsCollection.insertOne(booking);

      res.send(result);
    });

    app.get("/bookings", async (req, res) => {
      try {
        const result = await bookingsCollection.find().toArray();

        res.send(result);
      } catch (error) {
        res.status(500).send({
          message: "Failed to fetch bookings",
        });
      }
    });

    app.delete(
      "/bookings/:id",

      async (req, res) => {
        const id = req.params.id;

        const result = await bookingsCollection.deleteOne({
          _id: new ObjectId(id),
        });

        res.send(result);
      },
    );

    await client.db("admin").command({ ping: 1 });

    console.log("MongoDB Connected");
  } finally {
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("SportNest Server Running");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

 const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

const uri = process.env.MONGODB_URL;

 
//  FIXED MIDDLEWARES
 
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

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

 
    // SESSION API (IMPORTANT)
   
    app.get("/api/session", (req, res) => {
      res.json({ user: null });  
    });

    
    // FACILITY ROUTES
   
    app.get("/add-facility", async (req, res) => {
      const result = await facilityCollection.find().toArray();
      res.send(result);
    });

    app.post("/add-facility", async (req, res) => {
      const result = await facilityCollection.insertOne(req.body);
      res.send(result);
    });

    app.delete("/add-facility/:id", async (req, res) => {
      const result = await facilityCollection.deleteOne({
        _id: new ObjectId(req.params.id),
      });
      res.send(result);
    });

    app.put("/add-facility/:id", async (req, res) => {
      const updatedData = { ...req.body };
      delete updatedData._id;

      const result = await facilityCollection.updateOne(
        { _id: new ObjectId(req.params.id) },
        { $set: updatedData }
      );

      res.send(result);
    });
 
    app.post("/bookings", async (req, res) => {
      const result = await bookingsCollection.insertOne(req.body);
      res.send(result);
    });

    app.get("/bookings", async (req, res) => {
      const result = await bookingsCollection.find().toArray();
      res.send(result);
    });

    app.delete("/bookings/:id", async (req, res) => {
      const result = await bookingsCollection.deleteOne({
        _id: new ObjectId(req.params.id),
      });
      res.send(result);
    });
 
    app.get("/", (req, res) => {
      res.send("SportNest Server Running 🚀");
    });

    await client.db("admin").command({ ping: 1 });
    console.log("MongoDB Connected ✅");
  } catch (error) {
    console.log(error);
  }
}

run();


app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
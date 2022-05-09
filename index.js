const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const app = express();
//port
const port = process.env.PORT || 5000;

//MIDDLE WARE
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.htqi5.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
async function run() {
  try {
    await client.connect();
    const carCollection = client.db("marcedex-warehouse").collection("cars");

    //create
    app.post("/car", async (req, res) => {
      const newItem = req.body;
      const result = await carCollection.insertOne(newItem);
      res.send(result);
    });

    //Read
    // app.get("/car", async (req, res) => {
    //   const query = {};
    //   const cursor = carCollection.find(query);
    //   const cars = await cursor.toArray();
    //   res.send(cars);
    // });

    app.get("/car", async (req, res) => {
      const email = req.query.email;
      const query = { email: email };
      console.log(email);
      const cursor = carCollection.find(query);
      const cars = await cursor.toArray();
      res.send(cars);
    });

    app.get("/car/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const car = await carCollection.findOne(query);
      res.send(car);
    });
    //update
    app.put("/car/:id", async (req, res) => {
      const id = req.params.id;
      const newQuantity = req.body;
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updatedQuantity = {
        $set: {
          quantity: newQuantity.quantity,
        },
      };
      const result = await carCollection.updateOne(
        filter,
        updatedQuantity,
        options
      );
      res.send(result);
    });

    //delete
    app.delete("/car/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await carCollection.deleteOne(query);
      res.send(result);
    });

    //jsonwebtoken
    app.post("/login", async (req, res) => {
      const user = req.body;
      const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "1d",
      });
      res.send({ token });
    });
  } finally {
  }
}
run().catch(console.dir);

//api
app.get("/", (req, res) => {
  res.send("server is running");
});

app.listen(port, () => {
  console.log("listening to portfdf dddddfdfdf");
});

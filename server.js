require('dotenv').config();
const express = require("express");
const MongoClient = require("mongodb").MongoClient;

const app = express();
const PORT = process.env.PORT || 5050;
const MONGO_URL = process.env.MONGO_URL;
const client = new MongoClient(MONGO_URL);

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// GET all users
app.get("/getUsers", async (req, res) => {
  try {
    await client.connect();
    const db = client.db(process.env.MONGO_DB);
    const users = await db.collection('users').find({}).toArray();
    res.send(users);
  } catch (err) {
    console.error(err);
    res.status(500).send("DB Error");
  } finally {
    await client.close();
  }
});

// POST new user
app.post("/addUser", async (req, res) => {
  const userObj = req.body;
  try {
    await client.connect();
    const db = client.db(process.env.MONGO_DB);
    const result = await db.collection('users').insertOne(userObj);
    res.send(result);
  } catch (err) {
    console.error(err);
    res.status(500).send("DB Error");
  } finally {
    await client.close();
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

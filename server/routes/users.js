import express from "express";
import bcrypt from "bcrypt";
import { ObjectId } from "mongodb";
import db from "../db/connection.js";

const router = express.Router();

router.post('/login', async (req, res) => {
  let collection = await db.collection("users");
  let user = await collection.findOne({name: req.body.name});
  if (!user) return res.status(401).send('Invalid Credentials');

  try {
    if (await bcrypt.compare(req.body.password, user.password)) {
      res.status(200).send('Login Successful');
    } else {
      res.status(401).send('Invalid Credentials');
    }
  } catch {
    res.status(500).send();
  }
});

//router.get('/', (req, res) => res.json(test_users));

router.post('/', async (req, res) => {
  let collection = await db.collection("users");
  let result = await collection.findOne({email: req.body.email});
  if (result) return res.status(400).send('Account Already Exists')

  try {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    const user = { name: req.body.name, email: req.body.email, password: hashedPassword };
    collection.insertOne(user);
    res.status(201).send('Account Created');
  } catch {
    res.status(500).send();
  }
});

export default router;
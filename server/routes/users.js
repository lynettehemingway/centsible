import express from "express";
import bcrypt from "bcrypt";
//import { ObjectId } from "mongodb";
//import db from "../db/connection.js";

const router = express.Router();


//testing, replace with db
const test_users = [
  {
  "name": "Alice", "password": "123"
  }
  ]


router.post('/login', async (req, res) => {
  const user = test_users.find(user => user.name === req.body.name);
  if (!user) return res.status(400).send('User not found');


  //to do: implement database so we can actually use encrypted passwords

  try {
    //if (await bcrypt.compare(req.body.password, user.password)) {
    if (req.body.password == user.password){
      res.send('Login successful');
    } else {
      res.status(401).send('Wrong password');
    }
  } catch {
    res.status(500).send();
  }
});

router.get('/', (req, res) => res.json(test_users));

router.post('/', async (req, res) => {
  try {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    const user = { name: req.body.name, email: req.body.email, password: hashedPassword };
    test_users.push(user);
    res.status(201).send();
  } catch {
    res.status(500).send();
  }
});

export default router;
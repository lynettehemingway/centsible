import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { ObjectId } from "mongodb";
import db from "../db/connection.js";

dotenv.config({ path: ".env.local" });
const router = express.Router();



router.post('/login', async (req, res) => {
  let collection = await db.collection("users");
  let user = await collection.findOne({email: req.body.email}, {email: 1, _id: 0});
  if (!user) return res.status(401).send('Invalid Credentials');

  try {
    if (await bcrypt.compare(req.body.password, user.password)) {
      const userAuthToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '30m'});
      const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, {expiresIn: '7d'});

      const tokens = await collection.findOne({email: req.body.email}, {refreshTokens: 1, _id: 0});
      if (tokens.length >= 5) collection.updateOne({email: req.body.email}, {$pull: {refreshTokens: tokens[0]}});
      await collection.updateOne({email: req.body.email}, {$push: {refreshTokens: refreshToken}});


      res.status(200).send({userAuthToken: userAuthToken, refreshToken: refreshToken});
    } else {
      res.status(401).send('Invalid Credentials');
    }
  } catch {
    res.status(500).send();
  }
});



router.post('/signup', async (req, res) => {
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



router.get('/refresh', async (req, res) => {
  let collection = await db.collection("users");

  const refreshToken = req.body.refreshToken;
  if (refreshToken == null) return res.status(401).send();
  if (await collection.findOne({refreshTokens: refreshToken, email: req.body.email})) return res.status(403).send();

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) {
      collection.updateOne({email: req.body.email}, {$pull: {refreshTokens: req.body.refreshToken}});
      return res.status(403).send();
    }
    const userAuthToken = jwt.sign({email: user.email}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '30m'});
    res.status(200).send({userAuthToken: userAuthToken});
  })
});



router.delete('/logout', async (req, res) => {
  let collection = await db.collection("users");

  await collection.updateOne({email: req.body.email}, {$pull: {refreshTokens: req.body.refreshToken}});

  res.status(204).send();
});



router.get('/', async (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) return res.status(403).send();
  
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {

    if (err) return res.status(401).send();

    req.user = user;
  })
  res.status(200).send(); //todo: send stuff needed to display on homepage
});


export default router;
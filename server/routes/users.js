import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import db from "../db/connection.js";

import { defaultCategories } from "../constants/defaults.js";

dotenv.config({ path: ".env.local" });
const router = express.Router();


router.post('/login', async (req, res) => {
  let collection = await db.collection("users");

  const loginEmail = String(req.body.email);
  let user = await collection.findOne({email: loginEmail});

  if (!user) return res.status(401).send();
  else try {
    if (await bcrypt.compare(req.body.password, user.password)) {
      const payload = {email: user.email};
      const userAuthToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '30m'});
      const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {expiresIn: '7d'});

      const tokens = await collection.findOne({email: loginEmail});
      if (tokens.refreshTokens >= 5) collection.updateOne({email: loginEmail}, {$pull: {refreshTokens: tokens[0]}});
      await collection.updateOne({email: loginEmail}, {$push: {refreshTokens: refreshToken}});


      res.status(200).send({userAuthToken: userAuthToken, refreshToken: refreshToken});
    } else {
      res.status(401).send();
    }
  } catch {
    res.status(500).send();
  }
});



router.post('/signup', async (req, res) => {
  let collection = await db.collection("users");

  const signupName = String(req.body.name)
  const signupEmail = String(req.body.email);

  let result = await collection.findOne({email: signupEmail});
  if (result) return res.status(400).send('Account already exists. Please login.')

  try {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const payload = {email: signupEmail};
    const userAuthToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '30m'});
    const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {expiresIn: '7d'});
    
    const user = { 
      name: signupName,
      email: signupEmail,
      password: hashedPassword,
      categories: defaultCategories,
      refreshTokens: [refreshToken],
      expenses: [],
    };
    collection.insertOne(user);

    res.status(201).send({userAuthToken: userAuthToken, refreshToken: refreshToken});
  } catch {
    res.status(500).send();
  }
});



router.post('/refresh', async (req, res) => {
  let collection = await db.collection("users");

  const refreshToken = String(req.body.refreshToken);
  if (!refreshToken) return res.status(400).send();

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, user) => {
    if (err) {
      return res.status(403).send();
    }

    if (!await collection.findOne({email: user.email, refreshTokens: refreshToken})) return res.status(403).send();
    const userAuthToken = jwt.sign({email: user.email}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '30m'});
    return res.status(200).send({userAuthToken: userAuthToken});
  })
});



router.delete('/logout', async (req, res) => {
  let collection = await db.collection("users");
  
  const logoutEmail = String(req.body.email);
  const refreshToken = String(req.body.refreshToken);

  await collection.updateOne({email: logoutEmail}, {$pull: {refreshTokens: refreshToken}});

  res.status(204).send();
});



export default router;
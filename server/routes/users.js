import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { ObjectId } from "mongodb";
import db from "../db/connection.js";

dotenv.config({ path: ".env.local" });
const router = express.Router();

const defaultCategories = [
  'Food',
  'Transport',
  'Entertainment',
  'Utilities',
  'Other',
];



router.post('/login', async (req, res) => {
  let collection = await db.collection("users");
  const normalizedEmail = req.body.email.toLowerCase();
  let user = await collection.findOne({email: normalizedEmail});

  if (!user) return res.status(401).send();
  else try {
    if (await bcrypt.compare(req.body.password, user.password)) {
      const payload = { email: user.email };
      const userAuthToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '30m' });
      const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });

      const tokens = await collection.findOne({ email: normalizedEmail });
      if (tokens.refreshTokens.length >= 5) {
        await collection.updateOne({ email: normalizedEmail }, { $pop: { refreshTokens: -1 } });
      }
      await collection.updateOne({ email: normalizedEmail }, { $push: { refreshTokens: refreshToken } });


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
  let result = await collection.findOne({email: req.body.email});
  if (result) return res.status(400).send('Account already exists. Please login.')

  try {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const payload = {email: req.body.email};
    const userAuthToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '30m'});
    const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {expiresIn: '7d'});
    
    const user = { 
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
      categories: defaultCategories,
      refreshTokens: [refreshToken]
    };
    collection.insertOne(user);

    res.status(201).send({userAuthToken: userAuthToken, refreshToken: refreshToken});
  } catch {
    res.status(500).send();
  }
});



router.post('/refresh', async (req, res) => {
  let collection = await db.collection("users");

  const refreshToken = req.body.refreshToken;
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

  await collection.updateOne({email: req.body.email}, {$pull: {refreshTokens: req.body.refreshToken}});

  res.status(204).send();
});



router.get('/', authenticateToken, async (req, res) => {
  res.status(200).send({ user: req.user });
});



router.post('/addexpense', authenticateToken, async (req, res) => {
  let collection = await db.collection("users");
  await collection.updateOne({email: req.user.email}, {$push: {expenses: req.body}});
  res.status(200).send();
});


function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(400);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(401);
    req.user = user;
    next();
  });
}


export default router;
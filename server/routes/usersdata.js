import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import db from "../db/connection.js";

dotenv.config({ path: ".env.local" });
const router = express.Router();

router.post('/', authenticateToken, async (req, res) => {
  res.status(200).send({ user: req.user });
});


router.post('/addexpense', authenticateToken, async (req, res) => {
  let collection = await db.collection("users");

  const userEmail = String(req.user.email);
  const date = new Date(req.body.date);
  const category = String(req.body.category);
  const amount = parseFloat(req.body.amount);

  const expense = {date, category, amount};

  await collection.updateOne({email: userEmail}, {$push: {expenses: expense}});
  res.status(201).send();
});


router.get('/getdashboard', authenticateToken, async (req, res) => {
  let collection = await db.collection("users");


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
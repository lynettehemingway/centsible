import express from "express";
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


router.post('/addbudget', authenticateToken, async (req, res) => {
  let collection = await db.collection("users");

  const userEmail = String(req.user.email);
  const name = new Date(req.body.name);
  const timeperiod = String(req.body.timeperiod);
  const amount = parseFloat(req.body.amount);

  const budget = {name, timeperiod, amount};

  await collection.updateOne({email: userEmail}, {$push: {budgets: budget}});
  res.status(201).send();
});

router.get('/getbudget', authenticateToken, async (req, res) => {
  let collection = await db.collection("users");

  const user = await collection.findOne({ email: req.user.email }, { projection: { budgets: 1, _id: 0 } });
  if (user && user.budgets) res.status(200).send({budgets: user.budgets});
  else res.status(404).send();
});

router.get('/getcategories', authenticateToken, async (req, res) => {
  let collection = await db.collection("users");

  const user = await collection.findOne({ email: req.user.email }, { projection: { categories: 1, _id: 0 } });
  if (user && user.categories) res.status(200).send({categories: user.categories});
  else res.status(404).send();
});

router.get('/getname', authenticateToken, async (req, res) => {
  let collection = await db.collection("users");

  const user = await collection.findOne({ email: req.user.email }, { projection: { name: 1, _id: 0 } });
  if (user && user.name) res.status(200).send({name: user.name});
  else res.status(404).send();
});

router.get('/expenses/summary', authenticateToken, async (req, res) => {
  let collection = await db.collection("users");

  const { month, year } = req.query;
  const user = await collection.findOne({email: req.user.email});

  if (user){
  try{
  const filteredExpenses = user?.expenses.filter(exp => {
    const date = new Date(exp.date);
    return (
      date.getFullYear() === parseInt(year) && date.getMonth() === parseInt(month)
    );
  });

  const totals = {};
  for (const exp of filteredExpenses){
    if (!totals[exp.category]) totals[exp.category] = 0;
    totals[exp.category] += exp.amount;
  }

  const summary = Object.entries(totals).map(([category, totalAmount]) => ({
    category, totalAmount
  }));

  return res.json(summary);
} catch (err){
  return res.status(404).send();
}
}
return res.status(404).send();
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
const express = require('express')
const app = express()
const bcrypt = require('bcrypt')
const cors = require('cors');

app.use(cors());
app.use(express.json())
const users = []

app.post('/users/login', async (req, res) => {
    const user = users.find(user => user.name === req.body.name);
    if (!user) return res.status(400).send('User not found');
  
    try {
      if (await bcrypt.compare(req.body.password, user.password)) {
        res.send('Login successful');
      } else {
        res.status(401).send('Wrong password');
      }
    } catch {
      res.status(500).send();
    }
  });
  
  app.get('/users', (req, res) => res.json(users));
  
  app.post('/users', async (req, res) => {
    try {
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(req.body.password, salt);
      const user = { name: req.body.name, password: hashedPassword };
      users.push(user);
      res.status(201).send();
    } catch {
      res.status(500).send();
    }
  });
  
  app.listen(3000, () => console.log('Server running on port 3000'));
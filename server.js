const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// POST route to receive form data
app.post('/submit', (req, res) => {
  const { name, email, message } = req.body;

  const newEntry = {
    name,
    email,
    message,
    timestamp: new Date().toISOString()
  };

  const dataPath = path.join(__dirname, 'data', 'messages.json');

  // Read existing data
  fs.readFile(dataPath, 'utf8', (err, data) => {
    let messages = [];
    if (!err && data) {
      messages = JSON.parse(data);
    }

    messages.push(newEntry);

    // Save back
    fs.writeFile(dataPath, JSON.stringify(messages, null, 2), (err) => {
      if (err) {
        return res.status(500).send('Error saving message');
      }
      res.send('Message received!');
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

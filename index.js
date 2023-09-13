const express = require('express');
const path = require('path');
const PORT = 3000;
require('dotenv').config();

const onThisDayRouter = require('./routes/onThisDay');
const apodRouter = require('./routes/apod');
const weatherRouter = require('./routes/weather');
const counterRouter = require('./routes/counter');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/home.html'));
});

app.use('/onThisDay', onThisDayRouter);
app.use('/apod', apodRouter);
app.use('/weather', weatherRouter);
app.use('/counter', counterRouter);

app.listen(PORT, () =>
  console.log(`Listening on port ${PORT}......`)
);

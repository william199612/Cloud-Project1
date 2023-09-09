const express = require('express');
const path = require('path');
const PORT = 3000;
require('dotenv').config();

const onThisDayRouter = require('./routes/onThisDay');
const apodRouter = require('./routes/apod');

const app = express();

// app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/'));

// app.use('/', indexRouter);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/home.html'));
});

app.use('/onThisDay', onThisDayRouter);
app.use('/apod', apodRouter);

app.listen(PORT, () =>
  console.log(`Listening on port ${PORT}......`)
);

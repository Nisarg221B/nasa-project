const path = require('path');
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const v1router = require('./routes/versions/v1.api'); // for supporting multiple versions
const app = express(); // just a fancy listener function

// **************** Logger - morgan ****************** 
app.use(morgan('dev')); 

// **************** Body Parsing ****************** 
app.use(express.json());

// **************** hosting static files ****************** 
app.use(express.static(path.join(__dirname, '..', 'public')));

// **************** Routes ****************** 
app.use('/v1',v1router);
// app.use('/v2',v2router);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

module.exports = app;

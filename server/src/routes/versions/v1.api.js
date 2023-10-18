const express = require('express');

const planetsRouter = require('../planets/planets.router');
const launchsRouter = require('../launches/launches.router');

const api = express.Router();

api.use('/launches',launchsRouter); // lauches routes
api.use('/planets',planetsRouter); // planet routes

module.exports = api;  
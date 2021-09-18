const express = require('express');
const { validateToken } = require('../../utils');

const TournamentController = require('../controllers/tournaments')
const api = express.Router();

api.get('/tournaments', validateToken, TournamentController.getTournaments)
api.post('/tournament', validateToken, TournamentController.postTournament)
api.post('/tournament/signup', validateToken, TournamentController.signUpTournament)
api.get('/tournament', validateToken, TournamentController.getTournament)

module.exports = api
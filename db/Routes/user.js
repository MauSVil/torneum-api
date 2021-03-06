const { validateToken } = require('../../utils');

const express = require('express');
const UserController = require('../controllers/user')
const api = express.Router();

api.get('/user', validateToken, UserController.getUser)
api.get('/users', validateToken, UserController.getUsers)
api.post('/user', validateToken, UserController.postUser)
api.put('/user', validateToken, UserController.editUser)
api.post('/user/signup', UserController.userSignUp)
api.post('/user/signin', UserController.userSignIn)

module.exports = api
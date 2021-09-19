const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt')

const mongoose = require('mongoose');
const User = require('../Models/user');

const getUser = (req, res) => {
  const { userLoggedIn: { email } } = req.body;
  User.find({ email }).populate('friends').exec((err, user) => {
    res.json({
      error: null,
      data: user,
    })
  })
}

const getUsers = (req, res) => {
  User.find().exec((err, users) => {
    res.send(users)
  })
}

const postUser = async (req, res) => {
  const body = req.body;
  const user = await new User({
    name: body.name,
    email: body.email,
    twitchAccount: body.twitchAccount,
    role: body.role
  });

  await user.save();
  res.json({
    action: "Create User",
    data: user
  })
}

const editUser = async (req, res) => {
  const body = req.body;
  const tournamentId = mongoose.Types.ObjectId(body.tournamentId)
  const pastUser = await User.findOne({ name: body.name})
  const user = await User.findOneAndUpdate({
    name: body.name,
  }, {
    tournamentsIn: [...pastUser.tournamentsIn, tournamentId]
  }, {
    new: true
  })

  await user.save();
  res.json({
    action: "User modified",
    data: user
  })
}

const userSignUp = async (req, res) => {
  const body = req.body;
  const userExist = await User.findOne({ email: body.email });

  const salts = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(body.password, salts);

  if (!userExist) {
    const user = await new User({
      name: body.name,
      email: body.email,
      password: hash,
      twitchAccount: body.twitchAccount,
      role: body.role
    });
  
    await user.save();
    res.json({
      action: "Create User",
      data: user,
      error: null
    })
  } else {
    res.json({
      action: "Create User",
      data: null,
      error: 'El usuario ya existe'
    })
  }
}

const userSignIn = async (req, res) => {
  const body = req.body;
  const userExist = await User.findOne({
    email: body.email
  })

  if (userExist) {
    const compareResult = await bcrypt.compare(body.password, userExist.password);

    if (compareResult) {
      jwt.sign(
        {email: userExist.email, password: userExist.password},
        'secretKey',
        (err, token) => {
          if (!err) {
            res.json({
              action: 'Sign In',
              data: {
                userExist,
                token
              },
              error: null
            })
          }
        }
      )
    } else {
      res.json({
        action: 'Sign In',
        data: null,
        error: 'El usuario o contrase;a no son correctos'
      })
    }
  } else {
    res.json({
      action: 'Sign In',
      data: null,
      error: 'El usuario o contrase;a no son correctos'
    })
  }
}

const getFriendsList = async (req, res) => {
  const filter = req.body;
  const regex = new RegExp(filter);
  if (Object.values(filter).length !== 0) {
    const friendsList = await User.find({ name: { "$regex": regex, "$options": 'i' } });
    res.json({
      error: null,
      data: friendsList,
    })
  } else {
    res.json({
      error: null,
      data: []
    })
  }
};

module.exports = {
  getUser,
  getUsers,
  postUser,
  editUser,
  userSignUp,
  userSignIn,
  getFriendsList,
}
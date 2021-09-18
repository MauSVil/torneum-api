const mongoose = require('mongoose');

const Tournament = require('../Models/tournaments');
const User = require('../Models/user');

const getTournaments = (req, res) => {
  Tournament.find().exec((err, tournaments) => {
    res.send(tournaments)
  })
}

const postTournament = async (req, res) => {
  const body = req.body;
  const tournament = await new Tournament({
    name: body.name,
    userRegistered: 0,
    hidden: false,
    meta: {
      ability: 'Novice'
    }
  });

  await tournament.save();
  res.json({
    action: "Create Product",
    data: tournament
  })
}

const getTournament = async (req, res) => {
  const id = req.query.id;
  const tournament = await Tournament.findById(id)
  if (tournament) {
    res.json({
      error: null,
      data: tournament
    });
  } else {
    res.json({
      error: 'No se encontre tournament',
      data: null
    })
  }
}

const signUpTournament = async (req, res) => {
  const body = req.body;

  const { email } = body.userLoggedIn;

  const tournamentId = mongoose.Types.ObjectId(body.tournamentId)
  const pastUser = await User.findOne({ email })

  if (!pastUser.tournamentsIn.includes(tournamentId)) {
    const user = await User.findOneAndUpdate({
      email,
    }, {
      tournamentsIn: [...pastUser.tournamentsIn, tournamentId]
    }, {
      new: true
    })
  
    const pastTournament = await Tournament.findOne({ _id: tournamentId });
    if (pastTournament) {
      const tournament = await Tournament.findOneAndUpdate({
        _id: tournamentId,
      }, {
        usersRegistered: pastTournament.usersRegistered + 1
      }, {
        new: true
      })
    
      await user.save();
      await tournament.save();
    
      res.json({
        action: 'Sign Up Tournament',
        data: {
          user,
          tournament
        },
        error: null
      })
    } else {
      res.json({
        action: 'Sign Up Tournament',
        data: null,
        error: 'El ID del torneo no existe'
      })
    }
  } else {
    res.json({
      action: 'Sign Up Tournament',
      data: null,
      error: 'El Usuario ya esta registrado en el torneo'
    })
  }
}

module.exports = {
  getTournaments,
  postTournament,
  signUpTournament,
  getTournament
}
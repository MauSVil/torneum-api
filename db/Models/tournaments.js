const mongoose = require('mongoose');
const { Schema } = mongoose;

const tournamentSchema = new Schema({
  name: String,
  usersRegistered: { type: Number, default: 0},
  created: { type: Date, default: Date.now },
  hidden: Boolean,
  startDate: Date,
  endDate: Date,
  meta: {
    ability: String,
  }
});

const TournamentModel = mongoose.model('Tournament', tournamentSchema);

module.exports = TournamentModel

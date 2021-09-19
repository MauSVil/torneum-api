const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
  active: { type: Boolean, default: false },
  name: String,
  email: String,
  password: String,
  created: { type: Date, default: Date.now },
  twitchAccount: String,
  role: { type: String, default: 'player' },
  tournamentsIn: { type: [mongoose.Schema.Types.ObjectId], default: []},
  friends: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  socketID: String,
  notifications: { type: Object, default: []}
});

const UserModel = mongoose.model('User', userSchema);

module.exports = UserModel

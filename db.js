const mongoose = require('mongoose');

const mongoDBConnection = () => {
  mongoose.connect(
    'mongodb+srv://root:root@tournament.vjima.mongodb.net/Tournament?retryWrites=true&w=majority',
    { useNewUrlParser: true, useUnifiedTopology: true },
    (err) => {
      if (err) {
        console.log(err)
      } else {
        console.log('DB Connected')
      }
  })
}

module.exports = {
  mongoDBConnection
}
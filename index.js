const express = require('express');
const cors = require('cors');
const http = require('http');
const { mongoDBConnection } = require('./db');
const socketIo = require("socket.io");

const User = require('./db/Models/user');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    credentials: true
  }
});

app.use(cors());
app.use(express.urlencoded({ extended: false }))
app.use(express.json())


// const axios = require('axios')

// const config = {
//   method: 'get',
//   url: 'https://s.activision.com/activision/login',
//   headers: { }
// };

// axios(config)
// .then(function (response) {

//   console.log(response.headers['set-cookie'][0].split(';')[0].replace('XSRF-TOKEN=', ''));
//   const data = {
//     'username': 'Maujr10@hotmail.com',
//     'password': 'Mau=r1c10',
//     'remember_me': true,
//     '_csrf': response.headers['set-cookie'][0].split(';')[0].replace('XSRF-TOKEN=', '')
//   }
//   axios.post('https://s.activision.com/do_login?new_SiteId=activision', params=data).then((data) => {
//     console.log(data)
//   });

// })
// .catch(function (error) {
//   console.log(error);
// });

const editActiveUser = async (data, value) => {
  const user = await User.findOneAndUpdate(
    { email: data.email },
    { active: value }
  )
  await user.save();
}

const editSocketIDUser = async (socket, data) => {
  const user = await User.findOneAndUpdate(
    { email: data.email },
    { socketID: socket.id }
  )
  await user.save();
}

const editUserActiveBySocketID = async (socket, data) => {
  const user = await User.findOneAndUpdate(
    {socketID: socket.id},
    {active: data}
  )
  if (user) {
    await user.save();
  }
}

io.on('connection', (socket) => {
  socket.on('userLoggedIn', (data) => {
    editSocketIDUser(socket, data);
    editActiveUser(data, true)
  })

  socket.on('notification', async ({ from, to, message }) => {
    const user = await User.find({ email: to })
    if (user[0].active) {
      io.to(user[0].socketID).emit('notification', { from, message })
    }
    const userUpdate = await User.findOneAndUpdate(
      { email: to },
      { notifications: [...user[0].notifications, {from, message, status: 'Pending'}]}
    )
    await userUpdate.save();
  })

  socket.on('disconnect', () => {
    editUserActiveBySocketID(socket, false)
  })
})

const tournamentRoutes = require('./db/Routes/tournaments')
const userRoutes= require('./db/Routes/user');
const bodyParser = require('body-parser');

mongoDBConnection();

app.get('/', (req, res) => {
  res.json({
    data: 'Este es home'
  })
})
app.use('/api', tournamentRoutes);
app.use('/api', userRoutes);

server.listen(7000, () => {
  console.log('Server initialized')
})
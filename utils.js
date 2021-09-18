const jwt = require('jsonwebtoken');

const validateToken = (req, res, next) => {
  const bearerHeader = req.headers['authorization'];
  if(typeof bearerHeader !== 'undefined') {
    const bearerToken = bearerHeader.split(" ")[1];
    jwt.verify(bearerToken, 'secretKey', (error, authData) => {
      if (!error) {
        req.body = {
          ...req.body,
          userLoggedIn: {
            email: authData.email,
            password: authData.password
          }
        };
        next()
      } else {
        res.status(404).json({
          data: null,
          error: 'Token no valido'
        })
      }
    })
  } else {
    res.status(404).json({
      data: null,
      error: 'Token no valido'
    })
  }
};

module.exports = {
  validateToken,
}
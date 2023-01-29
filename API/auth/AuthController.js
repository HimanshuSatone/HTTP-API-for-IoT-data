var express    = require('express');
var router     = express.Router();
var bodyParser = require('body-parser');
var User       = require('../user/User');
var jwt        = require('jsonwebtoken');
var bcrypt     = require('bcryptjs');
var config     = require('../config');
var mongoOp    = require('../user/digital');
var mongoop    = require('../user/analog');

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());


//FUNCTION TO REGISTER NEW USER 
router.post('/register', function(req, res) {
  
  var hashedPassword = bcrypt.hashSync(req.body.password, 8);//ENCRYPT THE PASSWORD
  
  User.create({
    name : req.body.name,
    email : req.body.email,
    password : hashedPassword //WILL STORE THE ECRYPTED VERSION OF THE PASSWORD
  },
  function (err, user) {
    if (err) return res.status(500).send("There was a problem registering the user.")

    // CREATION OF TOKEN USING USER ID
    var token = jwt.sign({ id: user._id }, config.secret, {
      expiresIn: 86400 // expires in 24 hours
    });

    res.status(200).send({ auth: true, token: token });
  }); 
});

//FUNCTION TO SEE THE USER'S CREDENTIALS USING TOKEN (WILL NOT SHOW PASSWORD)
router.get('/me', function(req, res) {

  var token = req.headers['x-access-token'];
  if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });
  
  jwt.verify(token, config.secret, function(err, decoded) {
    if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
    
    User.findById(decoded.id, 
  { password: 0 }, // projection
  function (err, user) {
    if (err) return res.status(500).send("There was a problem finding the user.");
    if (!user) return res.status(404).send("No user found.");

    res.status(200).send(user);
});
  });
});

//USER LOGIN AND GENERATION OF TOKEN FOR SENDING THE DATA 
router.post('/login', function(req, res) {

  User.findOne({ email: req.body.email }, function (err, user) {
    if (err) return res.status(500).send('Error on the server.');
    if (!user) return res.status(404).send('No user found.');

    var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
    if (!passwordIsValid) return res.status(401).send({ auth: false, token: null });

    var token = jwt.sign({ id: user._id }, config.secret, {
      expiresIn: 86400 // expires in 24 hours
    });

    res.status(200).send({ auth: true, token: token });
  });

});

//FUNCTION FOR USER TO LOGOUT
router.get('/logout', function(req, res) {
  res.status(200).send({ auth: false, token: null });
});

module.exports = router;
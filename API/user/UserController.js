var express      = require('express');
var router       = express.Router();
var bodyParser   = require('body-parser');
var User         = require('./User');
var mongoOp      = require('./digital');
var mongoop      = require('./analog');
var config       = require('../config');
var jwt          = require('jsonwebtoken');
var bcrypt       = require('bcryptjs');

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

// CREATES A NEW USER
router.post('/', function (req, res) {
    User.create({
            name : req.body.name,
            email : req.body.email,
            password : req.body.password
        }, 
        function (err, user) {
            if (err) return res.status(500).send("There was a problem adding the information to the database.");
            res.status(200).send(user);
        });
});

//POST DATA TO DIGITAL SENSOR SCHEMA
router.post('/digital',function(req,res){
        var token  = req.headers['x-access-token']; //TAKING TOKEN FROM THE USER
        var userid = req.headers['userid']; //TAKING USERID FROM THE USER
        if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });
        
        jwt.verify(token, config.secret, function(err, decoded) {
        if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
        
         User.findById(decoded.id, 
           { password: 0 }, // projection
         function (err, user) {
         if (err) return res.status(500).send("There was a problem finding the user.");
         if (!user) return res.status(404).send("No user found.");
         if (user.id == userid) // MATHING THE DECODED TOKEN AND USER ID
          {   //STORING DATA INTO DIGITAL SENSOR SCHEMA
              var db                = new mongoOp();
              var response          = {};
              db.id                 = req.body.id;
              db.key                = req.body.key;
              db.sensortype         = req.body.sensortype;
              db.sensorid           = req.body.sensorid;
              db.status             = req.body.status;
              db.datetime           = req.body.datetime;
        
               db.save(function(err){
              // save() WILL RUN insert() COMMAND FOR MONGODB
             // IT WILL ADD NEW DATA INTO THE COLLECTION
                 if(err) {
                   response = {"error" : true,"message" : "Error adding data"};
                         } 
                 else {
                 response = {"error" : false,"message" : "Data added"};
                      }
            res.json(response);
                });
          }
          if (user.id != userid) res.status(650).send("Wrong User Id");
          if (!userid) res.status(750).send("No User Id provided");
          });
          
        });
    });
    
// POST DATA INTO ANALOG SENSOR SCHEMA 
router.post('/analog',function(req,res){
        var token  = req.headers['x-access-token'];  //TAKING TOKEN FROM THE USER
        var userid = req.headers['userid']; //TAKING USER ID FROM THE USER  
        if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });
        
        jwt.verify(token, config.secret, function(err, decoded) {
        if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
        
         User.findById(decoded.id, 
           { password: 0 }, // PROJECTION
         function (err, user) {
         if (err) return res.status(500).send("There was a problem finding the user.");
         if (!user) return res.status(404).send("No user found.");
         if (user.id == userid)
          {   //STORING THE DATA INTO THE ANALOG SENSOR SCHEMA
              var bd                = new mongoop();
              var response          = {};
              bd.id                 = req.body.id;
              bd.key                = req.body.key;
              bd.sensortype         = req.body.sensortype;
              bd.sensorid           = req.body.sensorid;
              bd.min_sensor_value   = req.body.min_sensor_value;
              bd.max_sensor_value   = req.body.max_sensor_value;
              bd.sensitivity        = req.body.sensitivity;
              bd.sensor_value       = req.body.sensor_value;
              bd.datetime           = req.body.datetime;
        
              bd.save(function(err){
                 // save() WILL RUN insert() COMMAND OF MONGODB
                 // IT WILL ADD NEW DATA IN COLLECTION.
                 if(err) {
                   response = {"error" : true,"message" : "Error adding data"};
                         } 
                 else {
                 response = {"error" : false,"message" : "Data added"};
                      }
            res.json(response);
                });
          }
          if (user.id != userid) res.status(650).send("Wrong User Id");
          if (!userid) res.status(750).send("No User Id provided");
          });
          
        });
    });    


// RETURNS ALL THE USERS IN THE DATABASE
router.get('/', function (req, res) {
    User.find({}, function (err, users) {
        if (err) return res.status(500).send("There was a problem finding the users.");
        res.status(200).send(users);
    });
});


// GETS A SINGLE USER FROM THE DATABASE
router.get('/:id', function (req, res) {
    User.findById(req.params.id, function (err, user) {
        if (err) return res.status(500).send("There was a problem finding the user.");
        if (!user) return res.status(404).send("No user found.");
        res.status(200).send(user);
    });
});

// DELETES A USER FROM THE DATABASE
router.delete('/:id', function (req, res) {
    User.findByIdAndRemove(req.params.id, function (err, user) {
        if (err) return res.status(500).send("There was a problem deleting the user.");
        res.status(200).send("User: "+ user.name +" was deleted.");
    });
});

// UPDATES A SINGLE USER IN THE DATABASE
router.put('/:id', function (req, res) {
    User.findByIdAndUpdate(req.params.id, req.body, {new: true}, function (err, user) {
        if (err) return res.status(500).send("There was a problem updating the user.");
        res.status(200).send(user);
    });
});

module.exports = router;
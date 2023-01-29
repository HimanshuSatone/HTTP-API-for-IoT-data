var mongoose    =   require("mongoose");
mongoose.connect('mongodb://localhost:27017/new1234');
// CREATE INSTANCE OF THE SCHEMA
var mongoSchema =   mongoose.Schema;
 // CREATE SCHEMA
var digital  = {
    "id" : String,
    "key" : Number,
    "sensortype" : String,
    "sensorid" : String,
    "status" : Number,
    "datetime" : Date
};
// CREATE MODEL IF NOT EXIST
module.exports = mongoose.model('digischema',digital);
// load mongoose since we need it to define a model
var mongoose = require('mongoose');
const { type } = require('os');
var Schema = mongoose.Schema;

userSchema = new Schema({
    username: String,
    password: String
});
module.exports = mongoose.model('users', userSchema);
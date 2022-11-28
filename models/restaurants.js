// load mongoose since we need it to define a model
var mongoose = require('mongoose');
const { type } = require('os');
require('mongoose-double')(mongoose);
var SchemaTypes = mongoose.Schema.Types;
var Schema = mongoose.Schema;

restaurantSchema = new Schema({
    address: {
        building: String,
        coord: [
            { type: [SchemaTypes.Double] }
        ],
        street: String,
        zipcode: String
    },
    borough: String,
    cuisine: String,
    grades: [
        {
            date: { type: Date, default: Date.now },
            grade: String,
            score: Number
        }
    ],
    name: String,
    restaurant_id: String
});
module.exports = mongoose.model('restaurants', restaurantSchema);
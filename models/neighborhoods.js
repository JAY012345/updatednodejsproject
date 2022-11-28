// load mongoose since we need it to define a model
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
neighborhoodSchema = new Schema({

    geometry: {
        coordinates: [{ type: String }],
        type: String
    },
    name: String

});
module.exports = mongoose.model('neighborhoods', neighborhoodSchema);

var express = require('express');
var mongoose = require('mongoose');
var database = require('../config/database');
var restaurant = require('../models/restaurants');
const { isFloat64Array } = require('util/types');

function allData(res) {

    console.log("HIIIIII");
    res.send("Hello")

}

function initialize() {
    const connectionParams = {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }

    mongoose.connect(database.url, connectionParams).then(() => {
        console.info("Connected to Database");
    }).catch((e) => {
        console.log("Error: ", e);
    })
}

function addNewRestaurant(data, res) {

    // create mongose method to create a new record into collection
    console.log(data.body);
    restaurant.create({
        address: {
            building: data.body.building,
            coord: [
                [parseFloat(data.body.lng), parseFloat(data.body.lat)]
            ],
            street: data.body.street,
            zipcode: data.body.zipcode
        },
        borough: data.body.borough,
        cuisine: data.body.cuisine,
        grades: [
            {
                date: data.body.date,
                grade: data.body.grade,
                score: data.body.score
            }
        ],
        name: data.body.name,
        restaurant_id: data.body.restaurant_id
    }, function (err, restaurantData) {
        if (err)
            res.send(err);
        // get and return all the employees after newly created employe record
        restaurant.find(function (err, restaurantData) {
            if (err)
                res.send(err)
            res.json(restaurantData);
        });
    });
}

function getRestaurantById(id, res) {
    restaurant.findById(id, function (err, restaurantData) {
        if (err)
            res.send(err)

        res.json(restaurantData);
    }
    )
}

function updateRestaurantById(data, id, res) {
    restaurant.findByIdAndUpdate(id, data, function (err, restaurantData) {
        if (err) throw err;

        res.send('Successfully! Rastaurant updated - ' + restaurantData.name);
    });
}

function deleteRestaurantById(id, res) {
    restaurant.deleteOne({
        _id: id
    }, function (err) {
        if (err)
            res.send(err);
        else
            res.send('Successfully! rastaurant Id  has been Deleted.');
    });
}

module.exports = { allData, initialize, addNewRestaurant, getRestaurantById, updateRestaurantById, deleteRestaurantById }
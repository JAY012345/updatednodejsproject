var express = require('express');
require('dotenv').config()
var mongoose = require('mongoose');
var restaurant = require('../models/restaurants');
var user = require('../models/users');
const { isFloat64Array } = require('util/types');
const { Result } = require('express-validator');
const bcrypt = require('bcrypt');
const users = require('../models/users');




function initialize() {

    const connectionParams = {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }

    mongoose.connect(process.env.URL, connectionParams).then(() => {
        console.log("Connected to Database");
    }).catch((e) => {
        console.log("Error: ", e);
    })
}

async function addUsers(data, res) {
    const hashedPassword = await bcrypt.hash(data.body.password, 10)
    // console.log(salt)
    console.log(hashedPassword)
    const usersSign = { username: data.body.username, password: hashedPassword }
    user.create(usersSign)

    res.render('userAdded')
}

async function loginUser(req, res) {
    user.find({ "username": req.body.username }, async function (err, result) {
        if (result.length == 0) {
            res.render('createUser')
        }
        else {
            if (await bcrypt.compare(req.body.password, result[0].password)) {
                res.render('LoggedIn')
            } else {
                res.render('passwordWrong')
            }
        }
    }
    );
}


function addNewRestaurant(data, res) {
    // create mongose method to create a new record into collection
    console.log(data.body)
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

function getAllRestaurants(page, perPage, borough, res) {

    console.log("you re in")
    checkBorough = {}
    var _page = parseInt(page)
    var _perPage = parseInt(perPage)

    if (borough != null) {
        checkBorough = { borough: borough }
    }

    var start = ((_page - 1) * _perPage)
    var end = _page * _perPage

    restaurant
        .find(checkBorough)
        .sort({ restaurant_id: 1 })
        .exec()
        .then((result) => {
            result = result.slice(start, end)
            res.json(result)
            // jData = JSON.parse(result)
            // res.render('formUI', {data : jData})
        })
        .catch((err) => {
            console.log(err)
            res.json(err)
        })
}


module.exports = { initialize, loginUser, addUsers, addNewRestaurant, getRestaurantById, updateRestaurantById, deleteRestaurantById, getAllRestaurants }
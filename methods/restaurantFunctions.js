var express = require('express');
require('dotenv').config()
var mongoose = require('mongoose');
var restaurant = require('../models/restaurants');
var user = require('../models/users');
const { isFloat64Array } = require('util/types');
const { Result } = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


function authi(req, res) {
    res.send(req.user);
}

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

async function addUsers(req, res) {

    const { username, password } = req.body
    try {
        const existingUser = await user.findOne({ username: username });
        if (existingUser) {
            res.render('UserAlreadythere');
        }
        const hashedPassword = await bcrypt.hash(req.body.password, 10)

        const result = {
            username: username,
            password: hashedPassword
        };
        const token = jwt.sign({ username: result.username, id: result._id }, process.env.SECRET_KEY);

        const result1 = {
            username: username,
            password: hashedPassword,
            token: token
        };

        user.create(result1)
        req.isUserAuthenticated = true;
        // res.status(201).json({user: result, token: token})
        res.render('userAdded')


    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong" })
    }

}


async function loginUser(req, res) {

    const existingUser = user.find({ "username": req.body.username }, async function (err, result) {
        if (result.length == 0) {
            res.render('createUser')

        }
        else {
            if (await bcrypt.compare(req.body.password, result[0].password)) {

                const token = jwt.sign({ username: user.username, user_id: user._id }, process.env.SECRET_KEY)

                req.session.verify = true;

                res.render('LoggedIn')

            } else {
                res.render('passwordWrong')
            }
        }
    }
    );
}

function addNewRestaurant(data, res) {
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

async function getAllRestaurants(page, perPage, borough, res) {


    console.log("you re in")
    checkBorough = {}
    var _page = parseInt(page)
    var _perPage = parseInt(perPage)

    if (borough != null) {
        checkBorough = { borough: borough }
    }

    var start = ((_page - 1) * _perPage)
    var end = _page * _perPage

    var data1 = await restaurant
        .find(checkBorough).lean()
        .sort({ restaurant_id: 1 })
        .exec()

        .then((result) => {
            result = result.slice(start, end)
            console.log(result)
            res.render('formUI', { data: result })
        })
        .catch((err) => {
            console.log(err)
            res.json(err)
        })
}


module.exports = { initialize, authi, loginUser, addUsers, addNewRestaurant, getRestaurantById, updateRestaurantById, deleteRestaurantById, getAllRestaurants }
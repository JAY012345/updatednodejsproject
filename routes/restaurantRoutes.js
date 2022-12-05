const express = require("express");
const { send } = require("process");
const router = express.Router();
var db = require('../methods/restaurantFunctions')
const passport = require('passport')


const initializePassport = require('../passport-config')
// initializePassport(passport)

const auth = require('../Middlewares/auth');

var app = express();
// app.use(express.urlencoded({extended:true}))

router.get('/', (req, res) => {
    res.render('welcome')
})

router.get('/restaurantData', (req, res) => {
    res.render('allData')
})

router.post('/users/signin', async function(req, res){
    
    db.addUsers(req, res)

})

router.post('/auth',auth, async function(req, res){
    
    db.authi(req, res)

})

router.post('/users/login',  async function(req, res){

    console.log("Login");
    db.loginUser(req, res);
    

})

router.get('/users/signinform', function(req, res){
    res.render('signin')
    
})

router.get('/users/loginform', function(req, res){
    res.render('login')
})


function jay(req, res, next){
    if('verify' in req.session && req.session.verify ){
        next();
    }else{
        res.render('welcome');
    }
}

router.get('/pageInfo',jay, (req, res) => {

    console.log(req.session);
    
    console.log(req.session.verify);
    var { page, perPage, borough } = req.query;
    
    db.getAllRestaurants(page, perPage, borough, res)
})

router.post('/', function (req, res) {

    db.addNewRestaurant(req, res)

})

router.get('/:restaurant_id', function (req, res) {
    let id = req.params.restaurant_id;
    db.getRestaurantById(id, res)
});

router.put('/:restaurant_id', function (req, res) {
    // create mongose method to update an existing record into collection
    let id = req.params.restaurant_id;

    var data = {
        address: {
            building: req.body.building,
            coord: [
                [parseFloat(req.body.lng), parseFloat(req.body.lat)]
            ],
            street: req.body.street,
            zipcode: req.body.zipcode
        },
        borough: req.body.borough,
        cuisine: req.body.cuisine,
        grades: [
            {
                date: req.body.date,
                grade: req.body.grade,
                score: req.body.score
            }
        ],
        name: req.body.name,
        restaurant_id: req.body.restaurant_id
    }

    db.updateRestaurantById(data, id, res)


});

router.delete('/:restaurant_id', function (req, res) {
    let id = req.params.restaurant_id;
    db.deleteRestaurantById(id, res)

});



module.exports = router
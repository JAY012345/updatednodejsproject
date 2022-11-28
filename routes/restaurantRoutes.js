const express = require("express")
const router = express.Router();
var db = require('../methods/restaurantFunctions')

var app = express();
// app.use(express.urlencoded({extended:true}))

router.get('/', (req, res) => {

    // return db.allData(res)
    res.render('allData');
})

router.get('/jay', (req, res) => {
    // res.send(req.params.title)
    var data = {
        name: req.body.title
    }
    console.log(data)
    res.json(req.query)
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
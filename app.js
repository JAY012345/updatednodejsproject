var express = require('express');
var mongoose = require('mongoose');
var app = express();
const path = require("path")
var bodyParser = require('body-parser');    
const router = require('./routes/restaurantRoutes')
var db = require('./methods/restaurantFunctions')
const exphbs = require('express-handlebars');

//joing public folder as static
app.use(express.static(path.join(__dirname, 'public')));
//staring engine with extension name :  .hbs
app.engine('.hbs', exphbs.engine({ extname: '.hbs' }));
app.set('view engine', 'hbs');

// pull information from HTML POST (express4)
var port = process.env.PORT || 8080;
app.use(bodyParser.urlencoded({ 'extended': 'true' }));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json


async function application(){
	await db.initialize();
	app.use('/api/restaurants', router)
}

application()

// App Litening
app.listen(port, () => {
    console.log("App Listening On Port : " + port);
});



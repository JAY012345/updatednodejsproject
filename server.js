var express = require('express');
var mongoose = require('mongoose');
var app = express();
const path = require("path")

var bodyParser = require('body-parser');
const router = require('./routes/restaurantRoutes')
var db = require('./methods/restaurantFunctions')
const exphbs = require('express-handlebars');
const cookieParser = require("cookie-parser");
const sessions = require('express-session');

//joing public folder as static
app.use(express.static(path.join(__dirname, 'public')));
//staring engine with extension name :  .hbs
app.engine('.hbs', exphbs.engine({ extname: '.hbs' }));
app.set('view engine', 'hbs');


var port = process.env.PORT || 3000;
app.use(bodyParser.urlencoded({ 'extended': 'true' }));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(express.json())

const oneDay = 1000 * 60 * 60 * 24;
app.use(sessions({
    secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
    saveUninitialized: true,
    cookie: { maxAge: oneDay },
    resave: false
}));

app.use(cookieParser());

async function application() {
    console.log("Line 37");
    await db.initialize();
    app.use('/api/restaurants', router)
}

application()

// App Litening
app.listen(port, () => {
    console.log("App Listening On Port : " + port);
});



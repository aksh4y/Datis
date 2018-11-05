var express = require('express');
var app = express();

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

var passport = require('passport');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var mongodb = require("mongodb");

app.use(session({
    secret: 'this is the secret',    // process.env.SESSION_SECRET
    resave: true,
    saveUninitialized: true
}));
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());


app.set('view engine', 'ejs');

app.use(express.static(__dirname + '/public'));

/*require ("./test/app.js")(app);*/
require("./server/app.js")(app);

var db;

// Connect to the database before starting the application server.
mongodb.MongoClient.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/test", function (err, client) {
    if (err) {
        console.log(err);
        process.exit(1);
    }
    // Save database object from the callback for reuse.
    db = client.db();
    console.log("Database connection ready");
    // Initialize the app.
    /*require("./passport/services/user.service.server");*/
    var port = process.env.PORT || 3000;

    app.listen(port);
});
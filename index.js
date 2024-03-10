const express = require ("express");
const { dbConnect } = require("./config/database.js");
const app = express ();

// cookie-parser
const cookieParser = require ("cookie-parser");
app.use (cookieParser);

// middleware
app.use (express.json());

// load env 
require ("dotenv").config ();

const PORT = process.env.PORT || 4000;

// calling dbConnect()
dbConnect ();

// import route and mount
const user = require ("./routes/user.routes.js");
app.use ("/api/v1", user);

// start the server
app.listen (PORT, () => {
    console.log (`Server is running on port ${PORT}`);
});

app.get ("/", (req, res) => {
    res.send (`<h1> This is the ultimate Homepage </h1>`);
});
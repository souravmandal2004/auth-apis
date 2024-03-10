const mongoose = require ("mongoose");
require ("dotenv").config();

exports.dbConnect = () => {
    mongoose.connect (process.env.DATABASE_URL, {
        // useNewUrlParser: true,
        // useUnifiedTopology: true
    })
    .then (() => {console.log ("DB connection successful")})
    .catch ( (error) => {console.log ("Error connecting to DB", error); process.exit (1);});
}

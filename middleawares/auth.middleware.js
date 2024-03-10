// 3 middlewares --> auth, isStudent, isAdmin

const jwt = require ("jsonwebtoken");
require ("dotenv").config ();

exports.auth =  (req, res, next) => {
    try {

        // Printing the token parser in body, cookies, header
        // console.log ("Body", req.body.token);
        // console.log ("Cookies", req.cookies.token);
        // console.log ("Header", req.header.token);
        // extract JWT token
        const token = req.body.token || req.cookies.token || req.header ("Authorization").replace ("Bearer ", "");

        // If token is not available
        if (!token || token === undefined) {
            return res.status (401). json ({
                success: false,
                message: "token missing",
            });
        }


        // Verify the token
        try {
            const decode = jwt.verify (token, process.env.JWT_SECRET);
            console.log ("Printing the decoded token");
            console.log (decode);

            req.user = decode;
        }

        catch (error) {
            res.status (401).json ({
                success: false, 
                message: "Token is invalid!",
            });
        }
        next ();
    }

    catch (error) {
        return res.status (401).json ({
            success: false, 
            message: "Something went wrong while verifying the token", 
            error: error.message
        });
    }
};

// middleware for student
exports.isStudent = (req, res, next) => {
    try {
        if (req.user.role !== "Student") {
            return res.status (401).json ({
                success: false,
                message: "This is a protected route for students",
            });
        }

        next ();
    }

    catch (error) {
        return res.status (500). json ({
            success: false,
            message: "User role is not matching",
            error: error.message
        });
    }
}

// middleware for admin
exports.isAdmin = (req, res, next) => {
    try {
        if (req.user.role !== "Admin") {
            return res.status (401).json ({
                success: false,
                message: "This is a protected route for admin"
            });
        }

        next ();
    }

    catch (error) {
        return res.status (500). json ({
            success: false, 
            message: "User role is not matching",
            error: error.message
        });
    }
}
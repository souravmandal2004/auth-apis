const User = require("../models/user.model");
const bcrypt = require("bcrypt"); // It is used to hash the password
const jwt = require("jsonwebtoken");
require("dotenv").config();

// signup route handler
exports.signup = async (req, res) => {
    try {
        // Get all data
        const { name, email, password, role } = req.body;

        // check if user already exists
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists",
            });
        }

        // secure password
        let hashedPassword;

        try {
            hashedPassword = await bcrypt.hash(password, 10);
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "Error in hashing password",
                error: error.message,
            });
        }

        // create entry of User in DB
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role,
        });

        // Now return the response
        return res.status(200).json({
            success: true,
            message: "User created successfully",
            user,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error while connectig with DB",
            error: error.message,
        });
    }
};

// login route handler
exports.login = async (req, res) => {
    try {
        // fetch the data
        const { email, password } = req.body;

        // Validation on email and password
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please fill all the details carefully",
            });
        }

        // Now check is the user exists or not
        let user = await User.findOne({ email });

        if (!user)
            return res.status(401).json({
                success: false,
                message: "User is not registered!",
            });

        const payload = {
            email: user.email,
            id: user._id,
            role: user.role,
        };

        // Verify password and generate a JWT token
        if (await bcrypt.compare(password, user.password)) {
            // password match
            // create a JWT token
            let token = jwt.sign(payload, process.env.JWT_SECRET, {
                expiresIn: "2h",
            });

            // Remove password from user object and add the token
            user = user.toObject();
            user.password = undefined;
            user.token = token;


            // create a cookie
            const options = {
                expires: new Date ( Date.now() + 3 * 24 * 60 * 60 * 1000),
                httpOnly: true,
            };

            res.cookie ("token", token, options)       // cookie (cookie_name, payload, options)
                .status (200).json ({
                    success: true,
                    token,
                    user,
                    message: "User logged in successfully"
                });

        }
        else {
            // Password doesn't match
            return res.status(403).json({
                success: false,
                message: "Password incorrect",
            });
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server Error",
            error: error.message,
        });
    }
};
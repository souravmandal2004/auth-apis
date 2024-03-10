const express = require ("express");
const router = express.Router ();
const User = require ("../models/user.model.js");

// import controllers
const {login} = require ("../controllers/auth.controller.js");
const {signup} = require ("../controllers/auth.controller.js");
const { auth, isStudent, isAdmin } = require ("../middleawares/auth.middleware.js");

// route the controllers
router.post ("/signup", signup);
router.post ("/login", login);

// protected routes

// for testing purpose 
// router.get ("/test", auth, (req, res) => {
//     res.json ({
//         success: true,
//         message: "Welcome to the protected route for tests",
//     });
// });


router.get ("/student", auth, isStudent, (req, res) => {
    res.json ({
        success: true, 
        message: "Welcome to the protected route for students"
    });
});

router.get ("/admin", auth, isAdmin, (req, res) => {
    res.json ({
        success: true,
        message: "Welcome to the protected route for admins",
    });
});

// router.get ("/getUserdata", auth, async (req, res) => {

//     try {
//         const id = req.user.id;
//         console.log ("Id: ", id);
//         const user = await User.findById (id);

//         res.status (200). json ({
//             success: true,
//             user: user,
//             message: "Welcome to user data route"
//         });
//     }

//     catch (error) {
//         res.status(500).json ({
//             success: false,
//             error: error.message,
//         });
//     }
// });

// export router
module.exports = router;
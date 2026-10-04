const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("./User");
const verifyCustomerToken =
    require("./customerMiddleware");
const router = express.Router();


/* ==========================================
   CUSTOMER REGISTER
========================================== */

router.post("/register", async (req, res) => {

    try {

        const {
            name,
            phone,
            email,
            password,
            address
        } = req.body;


        /* ----------------------------------
           VALIDATION
        ---------------------------------- */

        if (
            !name ||
            !phone ||
            !password
        ) {

            return res.status(400).json({
                message:
                    "Name, phone and password are required"
            });

        }


        if (password.length < 6) {

            return res.status(400).json({
                message:
                    "Password must be at least 6 characters"
            });

        }


        /* ----------------------------------
           CHECK EXISTING CUSTOMER
        ---------------------------------- */

        const existingUser =
            await User.findOne({
                phone: phone
            });


        if (existingUser) {

            return res.status(409).json({
                message:
                    "Phone number is already registered"
            });

        }


        /* ----------------------------------
           HASH PASSWORD
        ---------------------------------- */

        const hashedPassword =
            await bcrypt.hash(
                password,
                10
            );


        /* ----------------------------------
           CREATE CUSTOMER
        ---------------------------------- */

        const user =
            new User({

                name:
                    name.trim(),

                phone:
                    phone.trim(),

                email:
                    email
                        ? email.trim()
                        : "",

                password:
                    hashedPassword,

                address:
                    address
                        ? address.trim()
                        : ""

            });


        await user.save();


        /* ----------------------------------
           CREATE JWT
        ---------------------------------- */

        const token =
            jwt.sign(

                {
                    userId:
                        user._id.toString(),

                    role:
                        "customer",

                    phone:
                        user.phone

                },

                process.env.JWT_SECRET,

                {
                    expiresIn:
                        "7d"
                }

            );


        /* ----------------------------------
           RESPONSE
        ---------------------------------- */

        res.status(201).json({

            message:
                "Customer registered successfully",

            token:
                token,

            user: {

                id:
                    user._id,

                name:
                    user.name,

                phone:
                    user.phone,

                email:
                    user.email,

                address:
                    user.address

            }

        });


    } catch (error) {

        console.log(
            "Customer registration failed:",
            error.message
        );


        res.status(500).json({

            message:
                "Customer registration failed",

            error:
                error.message

        });

    }

});


/* ==========================================
   CUSTOMER LOGIN
========================================== */

router.post("/login", async (req, res) => {

    try {

        const {
            phone,
            password
        } = req.body;


        /* ----------------------------------
           VALIDATION
        ---------------------------------- */

        if (
            !phone ||
            !password
        ) {

            return res.status(400).json({
                message:
                    "Phone and password are required"
            });

        }


        /* ----------------------------------
           FIND CUSTOMER
        ---------------------------------- */

        const user =
            await User.findOne({
                phone: phone.trim()
            });


        if (!user) {

            return res.status(401).json({
                message:
                    "Invalid phone number or password"
            });

        }


        /* ----------------------------------
           CHECK PASSWORD
        ---------------------------------- */

        const passwordMatch =
            await bcrypt.compare(
                password,
                user.password
            );


        if (!passwordMatch) {

            return res.status(401).json({
                message:
                    "Invalid phone number or password"
            });

        }


        /* ----------------------------------
           CREATE JWT
        ---------------------------------- */

        const token =
            jwt.sign(

                {
                    userId:
                        user._id.toString(),

                    role:
                        "customer",

                    phone:
                        user.phone

                },

                process.env.JWT_SECRET,

                {
                    expiresIn:
                        "7d"
                }

            );


        /* ----------------------------------
           RESPONSE
        ---------------------------------- */

        res.json({

            message:
                "Customer login successful",

            token:
                token,

            user: {

                id:
                    user._id,

                name:
                    user.name,

                phone:
                    user.phone,

                email:
                    user.email,

                address:
                    user.address

            }

        });


    } catch (error) {

        console.log(
            "Customer login failed:",
            error.message
        );


        res.status(500).json({

            message:
                "Customer login failed",

            error:
                error.message

        });

    }

});

/* ==========================================
   CUSTOMER PROFILE
   LOGIN REQUIRED
========================================== */

router.get(
    "/profile",
    verifyCustomerToken,
    async (req, res) => {

        try {

            const user =
                await User.findById(
                    req.customer.userId
                ).select(
                    "-password"
                );


            if (!user) {

                return res.status(404).json({
                    message:
                        "Customer not found"
                });

            }


            res.json({

                id:
                    user._id,

                name:
                    user.name,

                phone:
                    user.phone,

                email:
                    user.email,

                address:
                    user.address

            });


        } catch (error) {

            console.log(
                "Customer profile failed:",
                error.message
            );


            res.status(500).json({

                message:
                    "Failed to get customer profile"

            });

        }

    }
);
module.exports = router;

const mongoose = require("mongoose");


/* ==========================================
   CUSTOMER USER SCHEMA
========================================== */

const userSchema = new mongoose.Schema(
    {

        name: {
            type: String,
            required: true,
            trim: true
        },


        phone: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },


        email: {
            type: String,
            trim: true,
            lowercase: true,
            default: ""
        },


        password: {
            type: String,
            required: true
        },


        address: {
    type: String,
    default: ""
},

cart: [
    {
        productId: {
            type: Number,
            required: true
        },

        quantity: {
            type: Number,
            required: true,
            min: 1,
            default: 1
        }
    }
]

    },

    {
        timestamps: true
    }
);


/* ==========================================
   EXPORT USER MODEL
========================================== */

module.exports =
    mongoose.model(
        "User",
        userSchema
    );

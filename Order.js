const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
    {
        orderId: {
            type: String,
            required: true,
            unique: true
        },

        customer: {
            name: {
                type: String,
                required: true
            },

            phone: {
                type: String,
                required: true
            },

            address: {
                type: String,
                required: true
            },

            city: {
                type: String,
                required: true
            },

            pincode: {
                type: String,
                required: true
            },

            state: {
                type: String,
                required: true
            }
        },

        items: [
            {
                productId: {
                    type: Number,
                    required: true
                },

                name: {
                    type: String,
                    required: true
                },

                price: {
                    type: Number,
                    required: true
                },

                quantity: {
                    type: Number,
                    required: true
                },

                image: {
                    type: String,
                    default: ""
                }
            }
        ],

        subtotal: {
            type: Number,
            required: true
        },

        delivery: {
            type: Number,
            default: 0
        },

        total: {
            type: Number,
            required: true
        },

        paymentMethod: {
            type: String,
            required: true
        },

        status: {
            type: String,
            default: "Pending"
        }
    },

    {
        timestamps: true
    }
);

module.exports = mongoose.model("Order", orderSchema);

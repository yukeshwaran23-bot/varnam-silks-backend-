const express = require("express");
const Order = require("./Order");
const customerMiddleware =
    require("./customerMiddleware");
const router = express.Router();

// CREATE NEW ORDER
router.post("/", customerMiddleware, async (req, res) => {
    try {
        const order = new Order({
    ...req.body,

    customerId: req.customer.userId,

    items: (req.body.items || []).map(item => ({
        productId: Number(item.productId || item.id),
        name: item.name,
        price: Number(item.price),
        quantity: Number(item.quantity),
        image: item.image || ""
    }))
});

        const savedOrder = await order.save();

        res.status(201).json({
            message: "Order created successfully",
            order: savedOrder
        });

    } catch (error) {

        console.log("Order creation failed:");
        console.log(error.message);

        res.status(500).json({
            message: "Failed to create order",
            error: error.message
        });
    }
});


// GET ALL ORDERS
router.get("/", async (req, res) => {
    try {

        const orders = await Order
            .find()
            .sort({ createdAt: -1 });

        res.json(orders);

    } catch (error) {

        res.status(500).json({
            message: "Failed to get orders",
            error: error.message
        });
    }
});


// GET ONE ORDER
// GET LOGGED-IN CUSTOMER ORDERS

router.get(
    "/my-orders",
    customerMiddleware,
    async (req, res) => {

        try {

            const orders =
    await Order.find({
        customerId: req.customer.userId
    }).sort({
        createdAt: -1
    });

            res.json(orders);

        } catch (error) {

            console.log(
                "Customer orders failed:",
                error.message
            );

            res.status(500).json({
                message:
                    "Failed to load customer orders"
            });

        }

    }
);
router.get("/:orderId", async (req, res) => {
    try {

        const order = await Order.findOne({
            orderId: req.params.orderId
        });

        if (!order) {

            return res.status(404).json({
                message: "Order not found"
            });

        }

        res.json(order);

    } catch (error) {

        res.status(500).json({
            message: "Failed to get order",
            error: error.message
        });
    }
});

// UPDATE ORDER STATUS
router.patch("/:orderId/status", async (req, res) => {

    try {

        const { status } = req.body;

        if (!status) {
            return res.status(400).json({
                message: "Status is required"
            });
        }

        const order = await Order.findOneAndUpdate(
            {
                orderId: req.params.orderId
            },
            {
                status: status
            },
            {
                new: true
            }
        );

        if (!order) {
            return res.status(404).json({
                message: "Order not found"
            });
        }

        res.json({
            message: "Order status updated successfully",
            order: order
        });

    } catch (error) {

        console.log(
            "Order status update failed:",
            error.message
        );

        res.status(500).json({
            message: "Failed to update order status",
            error: error.message
        });

    }

});
module.exports = router;

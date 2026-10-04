
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const productRoutes = require("./productRoutes");
const orderRoutes = require("./orderRoutes");
const adminRoutes = require("./adminRoutes");
const customerRoutes =
    require("./customerRoutes");
const app = express();

app.use(cors());
app.use(express.json({ limit: "10mb" }));

app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin", adminRoutes);
app.use(
    "/api/customer",
    customerRoutes
);
app.get("/", (req, res) => {
    res.json({
        message: "Varnam Silks Backend Running",
        database: mongoose.connection.readyState === 1
            ? "MongoDB Connected"
            : "MongoDB Not Connected"
    });
});

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log("MongoDB Connected Successfully");

        app.listen(PORT, () => {
            console.log(`Backend running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.log("MongoDB Connection Failed");
        console.log(error.message);
    });

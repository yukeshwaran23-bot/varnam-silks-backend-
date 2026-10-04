const express = require("express");
const Product = require("./Product");
const verifyAdminToken =
    require("./authMiddleware");

const router = express.Router();


/* ==========================================
   GET ALL PRODUCTS
   PUBLIC
========================================== */

router.get("/", async (req, res) => {

    try {

        const products =
            await Product.find()
                .sort({ id: 1 });

        res.json(products);

    } catch (error) {

        console.log(
            "Get products failed:",
            error.message
        );

        res.status(500).json({
            message: "Failed to get products",
            error: error.message
        });

    }

});


/* ==========================================
   GET SINGLE PRODUCT
   PUBLIC
========================================== */

router.get("/:id", async (req, res) => {

    try {

        const product =
            await Product.findOne({
                id: Number(req.params.id)
            });

        if (!product) {

            return res.status(404).json({
                message: "Product not found"
            });

        }

        res.json(product);

    } catch (error) {

        console.log(
            "Get single product failed:",
            error.message
        );

        res.status(500).json({
            message: "Failed to get product",
            error: error.message
        });

    }

});


/* ==========================================
   ADD PRODUCT
   ADMIN ONLY
========================================== */

router.post(
    "/",
    verifyAdminToken,
    async (req, res) => {

        try {

            const {
                name,
                type,
                price,
                image,
                description
            } = req.body;


            if (
                !name ||
                !type ||
                price === undefined ||
                !image
            ) {

                return res.status(400).json({
                    message:
                        "Name, type, price and image are required"
                });

            }


            /* ----------------------------------
               CREATE NEXT PRODUCT ID
            ---------------------------------- */

            const lastProduct =
                await Product.findOne()
                    .sort({ id: -1 });


            const nextId =
                lastProduct
                    ? Number(lastProduct.id) + 1
                    : 1;


            /* ----------------------------------
               CREATE PRODUCT
            ---------------------------------- */

            const product =
                new Product({

                    id: nextId,

                    name: name,

                    type: type,

                    price: Number(price),

                    image: image

                });


            await product.save();


            res.status(201).json({

                message:
                    "Product added successfully",

                product:
                    product

            });

        } catch (error) {

            console.log(
                "Add product failed:",
                error.message
            );

            res.status(500).json({

                message:
                    "Failed to add product",

                error:
                    error.message

            });

        }

    }
);


/* ==========================================
   EDIT PRODUCT
   ADMIN ONLY
========================================== */

router.patch(
    "/:id",
    verifyAdminToken,
    async (req, res) => {

        try {

            const productId =
                Number(req.params.id);


            const {
                name,
                type,
                price,
                image,
                description
            } = req.body;


            const updateData = {};


            if (name !== undefined) {
                updateData.name = name;
            }


            if (type !== undefined) {
                updateData.type = type;
            }


            if (price !== undefined) {
                updateData.price = Number(price);
            }


            if (image !== undefined) {
                updateData.image = image;
            }


            if (description !== undefined) {
                updateData.description =
                    description;
            }


            const product =
                await Product.findOneAndUpdate(

                    {
                        id: productId
                    },

                    updateData,

                    {
                        new: true,
                        runValidators: true
                    }

                );


            if (!product) {

                return res.status(404).json({
                    message:
                        "Product not found"
                });

            }


            res.json({

                message:
                    "Product updated successfully",

                product:
                    product

            });

        } catch (error) {

            console.log(
                "Edit product failed:",
                error.message
            );

            res.status(500).json({

                message:
                    "Failed to update product",

                error:
                    error.message

            });

        }

    }
);


/* ==========================================
   DELETE PRODUCT
   ADMIN ONLY
========================================== */

router.delete(
    "/:id",
    verifyAdminToken,
    async (req, res) => {

        try {

            const productId =
                Number(req.params.id);


            const product =
                await Product.findOneAndDelete({
                    id: productId
                });


            if (!product) {

                return res.status(404).json({
                    message:
                        "Product not found"
                });

            }


            res.json({

                message:
                    "Product deleted successfully",

                product:
                    product

            });

        } catch (error) {

            console.log(
                "Delete product failed:",
                error.message
            );

            res.status(500).json({

                message:
                    "Failed to delete product",

                error:
                    error.message

            });

        }

    }
);


module.exports = router;

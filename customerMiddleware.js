const jwt = require("jsonwebtoken");

function verifyCustomerToken(req, res, next) {

    const authHeader =
        req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({
            message:
                "Customer authentication required"
        });
    }

    const token =
        authHeader.startsWith("Bearer ")
            ? authHeader.split(" ")[1]
            : null;

    if (!token) {
        return res.status(401).json({
            message:
                "Invalid authorization format"
        });
    }

    try {

        const decoded =
            jwt.verify(
                token,
                process.env.JWT_SECRET
            );

        if (decoded.role !== "customer") {
            return res.status(403).json({
                message:
                    "Customer access required"
            });
        }

        req.customer = decoded;

        next();

    } catch (error) {

        return res.status(401).json({
            message:
                "Invalid or expired customer token"
        });

    }

}

module.exports =
    verifyCustomerToken;

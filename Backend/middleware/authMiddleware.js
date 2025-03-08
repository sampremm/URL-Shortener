import jwt from "jsonwebtoken";
import User from "../model/user.model.js";

export const protect = async (req, res, next) => {
    let token;

    // Ensure req.cookies exists before accessing properties
    if (req.cookies?.jwt) {
        token = req.cookies.jwt;
    } else {
        return res.status(401).json({ error: "Not authorized, no token" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select("-password");
        next();
    } catch (error) {
        console.error(error);
        return res.status(401).json({ error: "Not authorized, token failed" });
    }
};

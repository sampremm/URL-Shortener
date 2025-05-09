import User from "../model/user.model.js";
import { generateToken } from "../utils/generateToken.js";

export const registeruser = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            console.warn("Registration failed: Missing fields");
            return res.status(400).json({ error: "All fields are required" });
        }

        const userExists = await User.findOne({ email });

        if (userExists) {
            console.warn(`Registration failed: User with email ${email} already exists`);
            return res.status(400).json({ error: "User already exists" });
        }

        const user = await User.create({ username, email, password });

        if (user) {
            const token = generateToken(user._id);
            res.cookie("jwt", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            });

            console.info(`User registered successfully: ${email}`);
            res.status(201).json({
                _id: user._id,
                username: user.username,
                email: user.email,
                token,
            });
        } else {
            console.error("Registration failed: Invalid user data");
            res.status(400).json({ error: "Invalid user data" });
        }
    } catch (error) {
        console.error("Error in registeruser:", error.message);
        res.status(500).json({ error: "Server Error", message: error.message });
    }
};

export const loginuser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            console.warn("Login failed: Missing email or password");
            return res.status(400).json({ error: "Email and Password are required" });
        }

        const user = await User.findOne({ email });

        if (user && (await user.matchPassword(password))) {
            const token = generateToken(user._id);

            res.cookie("jwt", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            });

            console.info(`User logged in successfully: ${email}`);
            res.json({
                _id: user._id,
                username: user.username,
                email: user.email,
                token,
            });
        } else {
            console.warn(`Login failed: Invalid credentials for email ${email}`);
            res.status(401).json({ error: "Invalid email or password" });
        }
    } catch (error) {
        console.error("Error in loginuser:", error.message);
        res.status(500).json({ error: "Server Error", message: error.message });
    }
};

export const profileuser = async (req, res) => {
    try {
        if (!req.user) {
            console.warn("Unauthorized access attempt to profile");
            return res.status(401).json({ error: "Unauthorized" });
        }

        console.info(`Profile accessed by user: ${req.user.email}`);
        res.json(req.user);
    } catch (error) {
        console.error("Error in profileuser:", error.message);
        res.status(500).json({ error: "Server Error", message: error.message });
    }
};

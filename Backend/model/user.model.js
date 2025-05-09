import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
});

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next(); // Ensure next() is not called twice
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

userSchema.pre("findOneAndUpdate", async function (next) {
    const update = this.getUpdate();
    if (update.password) {
        const salt = await bcrypt.genSalt(10);
        update.password = await bcrypt.hash(update.password, salt);
        this.setUpdate(update);
    }
    next();
});

userSchema.methods.matchPassword = async function (password) {
    try {
        return await bcrypt.compare(password, this.password);
    } catch (error) {
        console.error("Error comparing passwords:", error);
        return false;
    }
};

const User = mongoose.model("User", userSchema);

export default User;
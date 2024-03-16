const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const validator = require("validator");

const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    bioText: {
        type: String,
        default: "",
    },
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
});

// static signup method
userSchema.statics.signup = async function (username, email, password) {
    try {
        // Validation
        if (!username || !email || !password) {
            throw new Error("All fields must be filled");
        }
        if (!validator.isLength(username, { min: 3, max: 20 })) {
            throw new Error("Username must be between 3 and 20 characters");
        }
        if (!validator.isEmail(email)) {
            throw new Error("Email already in use or invalid format");
        }
        if (!validator.isStrongPassword(password)) {
            throw new Error("Password not strong enough");
        }

        const exists = await this.findOne({ $or: [{ username }, { email }] });
        if (exists) {
            throw new Error("Username or email already in use");
        }

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        const user = await this.create({ username, email, password: hash });
        return user;
    } catch (error) {
        throw new Error(error.message);
    }
};

// static login method
userSchema.statics.login = async function (username, password) {
    try {
        if (!username || !password) {
            throw new Error("All fields must be filled");
        }

        const user = await this.findOne({ username });
        if (!user) {
            throw new Error("User not found");
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            throw new Error("Incorrect password");
        }

        return user;
    } catch (error) {
        throw new Error(error.message);
    }
};

module.exports = mongoose.model("User", userSchema);

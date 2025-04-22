import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const registerUser = async ({ name, email, password, role, contact, address }) => {
    const existingUSer = await User.findOne({ email });
    if (existingUSer) {
        throw new Error("User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = await User.create({
        name,
        email,
        password: hashedPassword,
        role,
        contact,
        address
    });

    const token = jwt.sign(
        { id: newUser._id, role: newUser.role },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
    );

    return { user: newUser, token };
};

export const loginUser = async ({ email,password }) => {
    const user = await User.findOne({ email});
    if (!user) {
        throw new Error("User not found");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        throw new Error("Invalid password");
    }       

    const token = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
    );

    return { user, token };
};

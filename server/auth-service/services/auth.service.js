import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Register a new user
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

// Login a user
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

// Get user details by ID
export const getUserById = async (userId) => {
    const user = await User.findById(userId);
    if (!user) {
        throw new Error("User not found");
    }
    return user;
};

// Update user details by ID
export const updateUserById = async (userId, updateData) => {
    const user = await User.findByIdAndUpdate(userId, updateData, { new: true });
    if (!user) {
        throw new Error("User not found");
    }       
    return user;
};

// Delete user by ID
export const deleteUserById = async (userId) => {
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
        throw new Error("User not found");
    }       
    return user;
};

// Get all users
export const getAllUsersService = async () => {
    const users = await User.find();
    return users;
}
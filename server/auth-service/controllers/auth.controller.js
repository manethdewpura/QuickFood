import { registerUser, loginUser, getUserById, updateUserById, deleteUserById, getAllUsersService } from '../services/auth.service.js';

//Register a new user
export const register = async (req, res) => {
    try {
         const { name, email, password, role, contact, address } = req.body;
         const { token, user } = await registerUser({ name, email, password, role, contact, address });
        res.status(201).json({ token, user });
    }
    catch ( error ) {
        res.status(500).json({ message: error.message });
    }
};

//Login a user
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const { token, user } = await loginUser({ email, password });
        res.status(200).json({ token, user });
    }
    catch ( error ) {
        res.status(401).json({ message: error.message });
    }
};

//Get user details by ID
export const getUser = async (req, res) => {
    try {
        const userId = req.headers['x-user-id'];
        const user = await getUserById(userId);
        res.status(200).json({ user });
    }
    catch ( error ) {
        res.status(500).json({ message: error.message });
    }
};

//Update user details by ID
export const updateUser = async (req, res) => {
    try {
        const userId = req.headers['x-user-id'];
        const updateData = req.body;
        const user = await updateUserById(userId, updateData);
        res.status(200).json({ user });
    }
    catch ( error ) {
        res.status(500).json({ message: error.message });
    }
};

//Delete user by ID
export const deleteUser = async (req, res) => {
    try {
        const userId = req.headers['x-user-id'];
        await deleteUserById(userId);
        res.status(204).send();
    }
    catch ( error ) {
        res.status(500).json({ message: error.message });
    }
};

//Get all users
export const getAllUsers = async (req, res) => {
    try {
        const users = await getAllUsersService();
        res.status(200).json({ users });
    }
    catch ( error ) {
        res.status(500).json({ message: error.message });
    }
}


import { registerUser, loginUser } from '../services/auth.service.js';

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
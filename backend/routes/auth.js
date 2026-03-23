import express from 'express';
import jwt from 'jsonwebtoken';
import pool from '../config/db.js';

const secret = process.env.JWT_SECRET

const router = express.Router();
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '3000s'
    });
}

router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({ message: 'Please provide all required fields' });
    }
    const userExists = await pool.query('select * from users where email = $1', [email]);
    if (userExists.rows.length > 0) {
        return res.status(400).json({ message: 'User already exists' });
    }
    const newUser = await pool.query(
        'insert into users (name, email, password) values ($1, $2, $3) returning name,email,password', [name, email, password]
    );
    return res.status(201).json({ user: newUser.rows[0] });
})

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'Please provide all required fields' });
    }
    const user = await pool.query('select * from users where email = $1', [email]);
    if (user.rows.length === 0) {
        return res.status(400).json({ message: 'Invalid Credential' });
    }
    const userData = user.rows[0];
    let myToken = generateToken(userData)
    res.json({ user: { id: userData.id, name: userData.name, email: userData.email, token: myToken } })
    return res.status(201).json({ user: userData.rows[0] });
});


function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) {
        return res.status(401).json({ message: 'Authorization token required' });
    }
    jwt.verify(token, secret, (err, user) => {
        if (err) {
            if (err.name === 'TokenExpiredError') {
                return res.status(401).json({ message: 'Token expired' });
            }
            return res.status(403).json({ message: 'Invalid token' });
        }
        req.user = user;
        next();
    });
}

router.get('/checkToken', authenticateToken, (req, res) => {
    res.json({
        message: 'Access granted to protected data',
        user: req.user
    });
});




export default router;
import express from 'express';
import jwt from 'jsonwebtoken';
import pool from '../config/db.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || '123456';

const generateToken = (user) => {
    return jwt.sign({ id: user.id }, JWT_SECRET, {
        expiresIn: '1h'
    });
};

router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'All fields required' });
        }
        const userExists = await pool.query(
            'SELECT * FROM users WHERE email = $1',
            [email]
        );
        if (userExists.rows.length > 0) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const newUser = await pool.query(
            'INSERT INTO users (name, email, password) VALUES ($1,$2,$3) RETURNING *',
            [name, email, password]
        );
        res.status(201).json(newUser.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await pool.query(
            'SELECT * FROM users WHERE email = $1',
            [email]
        );
        if (user.rows.length === 0) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const userData = user.rows[0];
        if (userData.password !== password) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const token = generateToken(userData);
        res.json({ token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const authenticateToken = (req, res, next) => {
    try {
        const bearerToken = req.headers.authorization;
        if (!bearerToken) {
            return res.status(403).json({ message: 'Token missing' });
        }
        const token = bearerToken.split(' ')[1];
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();

    } catch (error) {
        console.error("JWT Error:", error);
        return res.status(401).json({ message: 'Invalid token' });
    }
};

router.get('/showWatchData', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const result = await pool.query(
            'SELECT * FROM watchData WHERE user_id = $1',
            [userId]
        );
        res.status(200).json(result.rows);
    } catch (error) {
        console.error("DB Error:", error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.post('/addWatch', authenticateToken, async (req, res) => {
    try {
        const { brand, gender, price } = req.body;
        const userId = req.user.id;
        const result = await pool.query(
            'INSERT INTO watchData (brand, gender, price, user_id) VALUES ($1,$2,$3,$4) RETURNING *',
            [brand, gender, price, userId]
        );
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/getSingleWatch/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const result = await pool.query(
            'SELECT * FROM watchData WHERE id = $1 AND user_id = $2',
            [id, userId]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Data not found" });
        }
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put('/updateWatchData/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { brand, gender, price } = req.body;
        const userId = req.user.id;
        const result = await pool.query(
            'UPDATE watchData SET brand=$1, gender=$2, price=$3 WHERE id=$4 AND user_id=$5 RETURNING *',
            [brand, gender, price, id, userId]
        );
        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'No data found or unauthorized' });
        }
        res.json({ message: "Updated successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete('/deleteWatchData/:id', authenticateToken, async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const userId = req.user.id;
        const result = await pool.query(
            'DELETE FROM watchData WHERE id=$1 AND user_id=$2 RETURNING *',
            [id, userId]
        );
        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'No data found or unauthorized' });
        }
        res.json({ message: 'Deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
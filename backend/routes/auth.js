import express from 'express';
import jwt from 'jsonwebtoken';
import pool from '../config/db.js';

const JWT_SECRET = process.env.JWT_SECRET || '123456';

const router = express.Router();

const generateToken = (user) => {
    return jwt.sign({ user }, JWT_SECRET, {
        expiresIn: '1d'
    });
};

router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Please provide all required fields' });
        }
        const userExists = await pool.query(
            'SELECT * FROM users WHERE email = $1',
            [email]
        );
        if (userExists.rows.length > 0) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const newUser = await pool.query(
            'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING name, email',
            [name, email, password]
        );
        console.log("🚀 ~ newUser:", newUser)
        return res.status(201).json({ user: newUser.rows[0] });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'Please provide all required fields' });
        }
        const user = await pool.query(
            'SELECT * FROM users WHERE email = $1',
            [email]
        );

        if (user.rows.length === 0) {
            return res.status(400).json({ message: 'Invalid Credential' });
        }
        const userData = user.rows[0];
        if (userData.password !== password) {
            return res.status(400).json({ message: 'Invalid Credential' });
        }
        const token = generateToken(userData);
        return res.status(200).json({
            user: {
                name: userData.name,
                email: userData.email
            },
            token
        });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader;

    if (!token) {
        return res.status(401).json({ message: 'Token missing' });
    }
    jwt.verify(token, JWT_SECRET, (err, resp) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid token' });
        }
        req.user = resp.user;
        next();
    });
}

router.get('/checkToken', authenticateToken, (req, res) => {
    return res.json({
        message: `Welcome, ${req.user.name}!`,
        user: req.user
    });
});

router.post('/showWatchData', authenticateToken, async (req, res) => {
    try {
        const { brand, gender, price } = req.body;
        if (!brand || !gender || !price) {
            return res.status(400).json({ message: 'Please provide all required fields' });
        }
        const insert_query = 'INSERT INTO watchData(brand, gender, price) VALUES ($1,$2,$3) returning *'
        pool.query(insert_query, [brand, gender, price], (err, result) => {
            if (err) {
                res.send(err)
            } else {
                res.send(result.rows)
            }
        })
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
})

router.put('/updateWatchData/:id', authenticateToken, async (req, res) => {
    try {
        const id = req.params.id;
        const brand = req.body.brand;
        const gender = req.body.gender;
        const price = req.body.price;

        const update_query = "UPDATE watchData SET brand=$1, gender=$2, price=$3 WHERE id=$4"

        pool.query(update_query, [brand, gender, price, id], (err, result) => {
            if (err) {
                res.send(err)
            } else {
                res.send("UPDATED")
            }
        })
    } catch (error) {
        return res.status(500).json({ error: err.message });
    }
})

router.delete('/deleteWatchData/:id', authenticateToken, async (req, res) => {
    try {
        const id = req.params.id;
        const delete_query = 'Delete from watchData where id = $1';
        pool.query(delete_query, [id], (err, result) => {
            if (err) {
                req.send(err)
            } else {
                res.send(result)
            }
        })
    } catch (error) {
        return res.status(500).json({ error: err.message });
    }
})
export default router;
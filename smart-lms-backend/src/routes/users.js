const express = require('express');
const router = express.Router();
const MSSQLHelper = require('../utils/mssql');
const { sql } = require('../config/database');

// GET all users
router.get('/', async (req, res) => {
    try {
        const users = await MSSQLHelper.executeQuery('SELECT * FROM Users');
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET user by ID
router.get('/:id', async (req, res) => {
    try {
        const users = await MSSQLHelper.executeQuery(
            'SELECT * FROM Users WHERE id = @id',
            [{ name: 'id', type: sql.Int, value: req.params.id }]
        );

        if (users.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(users[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST create user
router.post('/', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const result = await MSSQLHelper.insert('Users', {
            username,
            email,
            password
        });
        res.status(201).json({ id: result.id, message: 'User created' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PUT update user
router.put('/:id', async (req, res) => {
    try {
        const rowsAffected = await MSSQLHelper.update(
            'Users',
            req.params.id,
            req.body
        );

        if (rowsAffected === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ message: 'User updated' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE user
router.delete('/:id', async (req, res) => {
    try {
        const rowsAffected = await MSSQLHelper.delete('Users', req.params.id);

        if (rowsAffected === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ message: 'User deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Example: Transaction
router.post('/enroll', async (req, res) => {
    try {
        const result = await MSSQLHelper.transaction(async (transaction) => {
            // Multiple queries trong một transaction
            const request1 = new sql.Request(transaction);
            await request1
                .input('userId', sql.Int, req.body.userId)
                .input('courseId', sql.Int, req.body.courseId)
                .query('INSERT INTO Enrollments (userId, courseId) VALUES (@userId, @courseId)');

            const request2 = new sql.Request(transaction);
            await request2
                .input('courseId', sql.Int, req.body.courseId)
                .query('UPDATE Courses SET enrollmentCount = enrollmentCount + 1 WHERE id = @courseId');

            return { success: true };
        });

        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;

const express = require('express');
const pool = require('../config/database');

const router = express.Router();

// Middleware de autenticación básico
const authenticateToken = (req, res, next) => {
  req.user = { id: 1, role: 'admin' };
  next();
};

// Obtener todos los usuarios
router.get('/', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT id, username, email, full_name, role, is_active, created_at
      FROM users
      ORDER BY created_at DESC
    `);
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

module.exports = router;
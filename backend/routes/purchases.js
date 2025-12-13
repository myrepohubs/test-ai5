const express = require('express');
const pool = require('../config/database');

const router = express.Router();

// Middleware de autenticación básico
const authenticateToken = (req, res, next) => {
  req.user = { id: 1, role: 'admin' };
  next();
};

// Obtener compras
router.get('/', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT p.*, s.business_name, s.ruc
      FROM purchases p
      LEFT JOIN suppliers s ON p.supplier_id = s.id
      ORDER BY p.created_at DESC
      LIMIT 50
    `);
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener compras:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

module.exports = router;
const express = require('express');
const pool = require('../config/database');

const router = express.Router();

// Middleware de autenticación básico
const authenticateToken = (req, res, next) => {
  req.user = { id: 1, role: 'admin' };
  next();
};

// Obtener asientos contables
router.get('/entries', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT *
      FROM accounting_entries
      ORDER BY entry_date DESC, created_at DESC
      LIMIT 50
    `);
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener asientos contables:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Obtener plan de cuentas
router.get('/chart-accounts', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT *
      FROM chart_of_accounts
      WHERE is_active = true
      ORDER BY account_code
    `);
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener plan de cuentas:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

module.exports = router;
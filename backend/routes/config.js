const express = require('express');
const pool = require('../config/database');

const router = express.Router();

// Middleware de autenticación básico
const authenticateToken = (req, res, next) => {
  req.user = { id: 1, role: 'admin' };
  next();
};

// Obtener configuración de la empresa
router.get('/company', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT * FROM company_config LIMIT 1
    `);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Configuración no encontrada' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error al obtener configuración:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Actualizar configuración de la empresa
router.put('/company', authenticateToken, async (req, res) => {
  try {
    const { 
      company_name, ruc, address, phone, email, 
      logo_url, currency, tax_rate 
    } = req.body;

    const result = await pool.query(`
      INSERT INTO company_config (
        company_name, ruc, address, phone, email, 
        logo_url, currency, tax_rate
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      ON CONFLICT (ruc) DO UPDATE SET
        company_name = EXCLUDED.company_name,
        address = EXCLUDED.address,
        phone = EXCLUDED.phone,
        email = EXCLUDED.email,
        logo_url = EXCLUDED.logo_url,
        currency = EXCLUDED.currency,
        tax_rate = EXCLUDED.tax_rate,
        updated_at = CURRENT_TIMESTAMP
      RETURNING *
    `, [
      company_name, ruc, address, phone, email,
      logo_url, currency || 'PEN', tax_rate || 18.00
    ]);

    res.json({
      message: 'Configuración actualizada exitosamente',
      config: result.rows[0]
    });

  } catch (error) {
    console.error('Error al actualizar configuración:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

module.exports = router;
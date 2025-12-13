const express = require('express');
const pool = require('../config/database');

const router = express.Router();

// Middleware de autenticación básico
const authenticateToken = (req, res, next) => {
  req.user = { id: 1, role: 'admin' };
  next();
};

// Dashboard - Métricas principales
router.get('/dashboard', authenticateToken, async (req, res) => {
  try {
    // Ventas del mes actual
    const salesThisMonth = await pool.query(`
      SELECT COALESCE(SUM(total_amount), 0) as total
      FROM sales 
      WHERE DATE_TRUNC('month', sale_date) = DATE_TRUNC('month', CURRENT_DATE)
      AND status = 'completed'
    `);

    // Compras del mes actual
    const purchasesThisMonth = await pool.query(`
      SELECT COALESCE(SUM(total_amount), 0) as total
      FROM purchases 
      WHERE DATE_TRUNC('month', purchase_date) = DATE_TRUNC('month', CURRENT_DATE)
      AND status = 'received'
    `);

    // Productos con stock bajo
    const lowStockProducts = await pool.query(`
      SELECT COUNT(*) as count
      FROM products 
      WHERE stock_quantity <= min_stock_level AND is_active = true
    `);

    // Productos agotados
    const outOfStockProducts = await pool.query(`
      SELECT COUNT(*) as count
      FROM products 
      WHERE stock_quantity = 0 AND is_active = true
    `);

    // Valor total del inventario
    const inventoryValue = await pool.query(`
      SELECT COALESCE(SUM(stock_quantity * cost_price), 0) as total
      FROM products 
      WHERE is_active = true AND cost_price IS NOT NULL
    `);

    // Ventas por día (últimos 7 días)
    const salesLast7Days = await pool.query(`
      SELECT 
        DATE(sale_date) as date,
        COALESCE(SUM(total_amount), 0) as total
      FROM sales 
      WHERE sale_date >= CURRENT_DATE - INTERVAL '7 days'
      AND status = 'completed'
      GROUP BY DATE(sale_date)
      ORDER BY date
    `);

    res.json({
      salesThisMonth: parseFloat(salesThisMonth.rows[0].total),
      purchasesThisMonth: parseFloat(purchasesThisMonth.rows[0].total),
      lowStockProducts: parseInt(lowStockProducts.rows[0].count),
      outOfStockProducts: parseInt(outOfStockProducts.rows[0].count),
      inventoryValue: parseFloat(inventoryValue.rows[0].total),
      salesLast7Days: salesLast7Days.rows
    });

  } catch (error) {
    console.error('Error al obtener métricas del dashboard:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Reporte de inventario
router.get('/inventory', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        p.id, p.code, p.name, p.stock_quantity, p.min_stock_level,
        p.cost_price, p.unit_price,
        c.name as category_name,
        CASE 
          WHEN p.stock_quantity = 0 THEN 'Agotado'
          WHEN p.stock_quantity <= p.min_stock_level THEN 'Bajo Stock'
          ELSE 'Normal'
        END as status,
        COALESCE(p.stock_quantity * p.cost_price, 0) as total_value
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.is_active = true
      ORDER BY 
        CASE 
          WHEN p.stock_quantity = 0 THEN 1
          WHEN p.stock_quantity <= p.min_stock_level THEN 2
          ELSE 3
        END,
        p.name
    `);
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error al generar reporte de inventario:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

module.exports = router;
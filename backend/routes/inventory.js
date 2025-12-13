const express = require('express');
const { body, query, validationResult } = require('express-validator');
const pool = require('../config/database');

const router = express.Router();

// Middleware de autenticación (básico)
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token de acceso requerido' });
  }

  // Aquí iría la verificación del JWT en un sistema real
  req.user = { id: 1, role: 'admin' }; // Por ahora usamos un usuario mock
  next();
};

// Obtener productos con filtros
router.get('/products', authenticateToken, [
  query('page').optional().isInt({ min: 1 }).withMessage('Página debe ser un número entero positivo'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Límite debe estar entre 1 y 100'),
  query('search').optional().isLength({ min: 1 }).withMessage('Término de búsqueda no puede estar vacío'),
  query('category_id').optional().isInt({ min: 1 }).withMessage('ID de categoría inválido'),
  query('low_stock').optional().isBoolean().withMessage('low_stock debe ser boolean')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const search = req.query.search;
    const categoryId = req.query.category_id;
    const lowStock = req.query.low_stock;

    let whereClause = 'WHERE 1=1';
    const queryParams = [];
    let paramCount = 0;

    if (search) {
      paramCount++;
      whereClause += ` AND (p.name ILIKE $${paramCount} OR p.code ILIKE $${paramCount})`;
      queryParams.push(`%${search}%`);
    }

    if (categoryId) {
      paramCount++;
      whereClause += ` AND p.category_id = $${paramCount}`;
      queryParams.push(categoryId);
    }

    if (lowStock === 'true') {
      paramCount++;
      whereClause += ` AND p.stock_quantity <= p.min_stock_level`;
      queryParams.push();
    }

    // Consulta principal
    const productsQuery = `
      SELECT 
        p.id, p.code, p.name, p.description, p.unit_price, p.cost_price,
        p.stock_quantity, p.min_stock_level, p.unit, p.barcode, p.is_active,
        c.name as category_name,
        CASE 
          WHEN p.stock_quantity <= p.min_stock_level THEN 'low'
          WHEN p.stock_quantity = 0 THEN 'out'
          ELSE 'ok'
        END as stock_status
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      ${whereClause}
      ORDER BY p.name
      LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}
    `;

    queryParams.push(limit, offset);

    // Consulta para contar total
    const countQuery = `
      SELECT COUNT(*) as total
      FROM products p
      ${whereClause}
    `;

    const [productsResult, countResult] = await Promise.all([
      pool.query(productsQuery, queryParams),
      pool.query(countQuery, queryParams.slice(0, -2)) // Sin limit y offset
    ]);

    const total = parseInt(countResult.rows[0].total);
    const totalPages = Math.ceil(total / limit);

    res.json({
      products: productsResult.rows,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    });

  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Obtener producto por ID
router.get('/products/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(`
      SELECT 
        p.id, p.code, p.name, p.description, p.unit_price, p.cost_price,
        p.stock_quantity, p.min_stock_level, p.unit, p.barcode, p.is_active,
        c.id as category_id, c.name as category_name,
        CASE 
          WHEN p.stock_quantity <= p.min_stock_level THEN 'low'
          WHEN p.stock_quantity = 0 THEN 'out'
          ELSE 'ok'
        END as stock_status
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.id = $1
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    res.json(result.rows[0]);

  } catch (error) {
    console.error('Error al obtener producto:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Crear producto
router.post('/products', authenticateToken, [
  body('code').notEmpty().withMessage('Código es requerido'),
  body('name').notEmpty().withMessage('Nombre es requerido'),
  body('unit_price').isFloat({ min: 0 }).withMessage('Precio debe ser un número positivo'),
  body('cost_price').optional().isFloat({ min: 0 }).withMessage('Precio de costo debe ser positivo'),
  body('stock_quantity').optional().isInt({ min: 0 }).withMessage('Stock debe ser un número entero positivo'),
  body('min_stock_level').optional().isInt({ min: 0 }).withMessage('Stock mínimo debe ser positivo'),
  body('category_id').optional().isInt({ min: 1 }).withMessage('ID de categoría inválido')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { 
      code, name, description, unit_price, cost_price, 
      stock_quantity, min_stock_level, unit, barcode, category_id 
    } = req.body;

    // Verificar que el código no existe
    const existingProduct = await pool.query(
      'SELECT id FROM products WHERE code = $1',
      [code]
    );

    if (existingProduct.rows.length > 0) {
      return res.status(400).json({ error: 'El código de producto ya existe' });
    }

    const result = await pool.query(`
      INSERT INTO products (
        code, name, description, unit_price, cost_price, 
        stock_quantity, min_stock_level, unit, barcode, category_id
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
    `, [
      code, name, description, unit_price, cost_price,
      stock_quantity || 0, min_stock_level || 0, unit || 'unidad', 
      barcode, category_id
    ]);

    res.status(201).json({
      message: 'Producto creado exitosamente',
      product: result.rows[0]
    });

  } catch (error) {
    console.error('Error al crear producto:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Actualizar producto
router.put('/products/:id', authenticateToken, [
  body('code').optional().notEmpty().withMessage('Código no puede estar vacío'),
  body('name').optional().notEmpty().withMessage('Nombre no puede estar vacío'),
  body('unit_price').optional().isFloat({ min: 0 }).withMessage('Precio debe ser positivo'),
  body('cost_price').optional().isFloat({ min: 0 }).withMessage('Precio de costo debe ser positivo'),
  body('stock_quantity').optional().isInt({ min: 0 }).withMessage('Stock debe ser positivo'),
  body('min_stock_level').optional().isInt({ min: 0 }).withMessage('Stock mínimo debe ser positivo'),
  body('category_id').optional().isInt({ min: 1 }).withMessage('ID de categoría inválido')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const updateFields = req.body;

    // Verificar que el producto existe
    const existingProduct = await pool.query(
      'SELECT id FROM products WHERE id = $1',
      [id]
    );

    if (existingProduct.rows.length === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    // Construir query de actualización dinámicamente
    const fields = Object.keys(updateFields);
    const values = Object.values(updateFields);
    
    if (fields.length === 0) {
      return res.status(400).json({ error: 'No hay campos para actualizar' });
    }

    const setClause = fields.map((field, index) => 
      `${field} = $${index + 1}`
    ).join(', ');

    const query = `
      UPDATE products 
      SET ${setClause}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $${fields.length + 1}
      RETURNING *
    `;

    const result = await pool.query(query, [...values, id]);

    res.json({
      message: 'Producto actualizado exitosamente',
      product: result.rows[0]
    });

  } catch (error) {
    console.error('Error al actualizar producto:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Eliminar producto (soft delete)
router.delete('/products/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'UPDATE products SET is_active = false, updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    res.json({
      message: 'Producto desactivado exitosamente',
      product: result.rows[0]
    });

  } catch (error) {
    console.error('Error al eliminar producto:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Obtener categorías
router.get('/categories', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT id, name, description, is_active, created_at, updated_at
      FROM categories
      WHERE is_active = true
      ORDER BY name
    `);

    res.json(result.rows);

  } catch (error) {
    console.error('Error al obtener categorías:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Crear categoría
router.post('/categories', authenticateToken, [
  body('name').notEmpty().withMessage('Nombre es requerido'),
  body('description').optional().isString().withMessage('Descripción debe ser texto')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, description } = req.body;

    const result = await pool.query(`
      INSERT INTO categories (name, description) 
      VALUES ($1, $2) 
      RETURNING *
    `, [name, description]);

    res.status(201).json({
      message: 'Categoría creada exitosamente',
      category: result.rows[0]
    });

  } catch (error) {
    console.error('Error al crear categoría:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

module.exports = router;
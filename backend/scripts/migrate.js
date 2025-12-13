const pool = require('../config/database');

const migrations = {
  // Tabla de configuración de empresa
  '001_create_company_config': `
    CREATE TABLE IF NOT EXISTS company_config (
      id SERIAL PRIMARY KEY,
      company_name VARCHAR(255) NOT NULL,
      ruc VARCHAR(11) UNIQUE NOT NULL,
      address TEXT,
      phone VARCHAR(20),
      email VARCHAR(100),
      logo_url VARCHAR(500),
      currency VARCHAR(3) DEFAULT 'PEN',
      tax_rate DECIMAL(5,2) DEFAULT 18.00,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `,

  // Tabla de usuarios
  '002_create_users': `
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      username VARCHAR(50) UNIQUE NOT NULL,
      email VARCHAR(100) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      full_name VARCHAR(255) NOT NULL,
      role VARCHAR(20) DEFAULT 'cajero' CHECK (role IN ('admin', 'contador', 'cajero')),
      is_active BOOLEAN DEFAULT true,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `,

  // Tabla de categorías de productos
  '003_create_categories': `
    CREATE TABLE IF NOT EXISTS categories (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      description TEXT,
      is_active BOOLEAN DEFAULT true,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `,

  // Tabla de productos
  '004_create_products': `
    CREATE TABLE IF NOT EXISTS products (
      id SERIAL PRIMARY KEY,
      code VARCHAR(50) UNIQUE NOT NULL,
      name VARCHAR(255) NOT NULL,
      description TEXT,
      category_id INTEGER REFERENCES categories(id),
      unit_price DECIMAL(10,2) NOT NULL,
      cost_price DECIMAL(10,2),
      stock_quantity INTEGER DEFAULT 0,
      min_stock_level INTEGER DEFAULT 0,
      unit VARCHAR(20) DEFAULT 'unidad',
      barcode VARCHAR(100),
      is_active BOOLEAN DEFAULT true,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `,

  // Tabla de proveedores
  '005_create_suppliers': `
    CREATE TABLE IF NOT EXISTS suppliers (
      id SERIAL PRIMARY KEY,
      business_name VARCHAR(255) NOT NULL,
      ruc VARCHAR(11) UNIQUE NOT NULL,
      contact_person VARCHAR(255),
      phone VARCHAR(20),
      email VARCHAR(100),
      address TEXT,
      is_active BOOLEAN DEFAULT true,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `,

  // Tabla de clientes
  '006_create_customers': `
    CREATE TABLE IF NOT EXISTS customers (
      id SERIAL PRIMARY KEY,
      business_name VARCHAR(255),
      document_number VARCHAR(15),
      document_type VARCHAR(20) DEFAULT 'DNI' CHECK (document_type IN ('DNI', 'RUC', 'CE')),
      phone VARCHAR(20),
      email VARCHAR(100),
      address TEXT,
      is_active BOOLEAN DEFAULT true,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `,

  // Tabla de compras
  '007_create_purchases': `
    CREATE TABLE IF NOT EXISTS purchases (
      id SERIAL PRIMARY KEY,
      purchase_number VARCHAR(50) UNIQUE NOT NULL,
      supplier_id INTEGER REFERENCES suppliers(id),
      purchase_date DATE NOT NULL,
      subtotal DECIMAL(10,2) NOT NULL,
      tax_amount DECIMAL(10,2) DEFAULT 0,
      total_amount DECIMAL(10,2) NOT NULL,
      status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'received', 'cancelled')),
      notes TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `,

  // Tabla de detalles de compras
  '008_create_purchase_details': `
    CREATE TABLE IF NOT EXISTS purchase_details (
      id SERIAL PRIMARY KEY,
      purchase_id INTEGER REFERENCES purchases(id) ON DELETE CASCADE,
      product_id INTEGER REFERENCES products(id),
      quantity INTEGER NOT NULL,
      unit_price DECIMAL(10,2) NOT NULL,
      total_price DECIMAL(10,2) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `,

  // Tabla de ventas
  '009_create_sales': `
    CREATE TABLE IF NOT EXISTS sales (
      id SERIAL PRIMARY KEY,
      sale_number VARCHAR(50) UNIQUE NOT NULL,
      customer_id INTEGER REFERENCES customers(id),
      sale_date DATE NOT NULL,
      subtotal DECIMAL(10,2) NOT NULL,
      tax_amount DECIMAL(10,2) DEFAULT 0,
      total_amount DECIMAL(10,2) NOT NULL,
      payment_method VARCHAR(30) DEFAULT 'efectivo' CHECK (payment_method IN ('efectivo', 'tarjeta', 'yape', 'plin', 'transferencia')),
      status VARCHAR(20) DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'cancelled')),
      notes TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `,

  // Tabla de detalles de ventas
  '010_create_sale_details': `
    CREATE TABLE IF NOT EXISTS sale_details (
      id SERIAL PRIMARY KEY,
      sale_id INTEGER REFERENCES sales(id) ON DELETE CASCADE,
      product_id INTEGER REFERENCES products(id),
      quantity INTEGER NOT NULL,
      unit_price DECIMAL(10,2) NOT NULL,
      total_price DECIMAL(10,2) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `,

  // Tabla de asientos contables
  '011_create_accounting_entries': `
    CREATE TABLE IF NOT EXISTS accounting_entries (
      id SERIAL PRIMARY KEY,
      entry_number VARCHAR(50) UNIQUE NOT NULL,
      entry_date DATE NOT NULL,
      description TEXT NOT NULL,
      reference_type VARCHAR(50),
      reference_id INTEGER,
      total_debit DECIMAL(10,2) NOT NULL,
      total_credit DECIMAL(10,2) NOT NULL,
      is_balanced BOOLEAN DEFAULT true,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `,

  // Tabla de detalles de asientos contables
  '012_create_accounting_entry_details': `
    CREATE TABLE IF NOT EXISTS accounting_entry_details (
      id SERIAL PRIMARY KEY,
      entry_id INTEGER REFERENCES accounting_entries(id) ON DELETE CASCADE,
      account_code VARCHAR(20) NOT NULL,
      account_name VARCHAR(255) NOT NULL,
      description TEXT,
      debit_amount DECIMAL(10,2) DEFAULT 0,
      credit_amount DECIMAL(10,2) DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `,

  // Tabla de configuración de cuentas contables
  '013_create_chart_of_accounts': `
    CREATE TABLE IF NOT EXISTS chart_of_accounts (
      id SERIAL PRIMARY KEY,
      account_code VARCHAR(20) UNIQUE NOT NULL,
      account_name VARCHAR(255) NOT NULL,
      account_type VARCHAR(50) NOT NULL CHECK (account_type IN ('asset', 'liability', 'equity', 'revenue', 'expense')),
      parent_account_id INTEGER REFERENCES chart_of_accounts(id),
      is_active BOOLEAN DEFAULT true,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `
};

async function runMigrations() {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    // Crear tabla de migraciones si no existe
    await client.query(`
      CREATE TABLE IF NOT EXISTS migrations (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) UNIQUE NOT NULL,
        executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    // Obtener migraciones ejecutadas
    const result = await client.query('SELECT name FROM migrations ORDER BY executed_at');
    const executedMigrations = new Set(result.rows.map(row => row.name));
    
    // Ejecutar migraciones pendientes
    for (const [name, sql] of Object.entries(migrations)) {
      if (!executedMigrations.has(name)) {
        console.log(`Ejecutando migración: ${name}`);
        await client.query(sql);
        await client.query('INSERT INTO migrations (name) VALUES ($1)', [name]);
      } else {
        console.log(`Migración ya ejecutada: ${name}`);
      }
    }
    
    await client.query('COMMIT');
    console.log('✅ Todas las migraciones completadas exitosamente');
    
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Error durante las migraciones:', error);
    process.exit(1);
  } finally {
    client.release();
  }
}

// Ejecutar migraciones si se llama directamente
if (require.main === module) {
  runMigrations()
    .then(() => {
      console.log('🎉 Migraciones completadas');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Error en migraciones:', error);
      process.exit(1);
    });
}

module.exports = { runMigrations, migrations };
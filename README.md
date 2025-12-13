# ERP-Lite Perú

Sistema ERP (Enterprise Resource Planning) diseñado específicamente para PYMES peruanas.

## 🚀 Características Principales

- **Dashboard**: Panel de control con métricas del negocio
- **Inventario**: Gestión completa de productos y stock
- **Ventas**: Punto de venta (POS) y facturación electrónica
- **Compras**: Gestión de proveedores y órdenes de compra
- **Contabilidad**: Asientos contables y libros contables
- **Reportes**: Informes de ventas, stock y análisis financiero

### 🏢 Específico para Perú

- Moneda: Soles (S/)
- Documentos: RUC, Facturas, Boletas
- Impuestos: IGV (18%)
- Métodos de pago: Yape, Plin, transferencias

## 🛠️ Stack Tecnológico

### Frontend
- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Chart.js** (gráficos)
- **React Hook Form** (formularios)

### Backend
- **Node.js** + **Express.js**
- **PostgreSQL** (base de datos)
- **JWT** (autenticación)
- **bcryptjs** (encriptación)
- **express-validator** (validación)

### Herramientas
- **Git** + **GitHub**
- **ESLint**
- **PostCSS**

## 📋 Prerrequisitos

- Node.js 18+ 
- PostgreSQL 13+
- Git

## 🚀 Instalación

### 1. Clonar el repositorio
```bash
git clone https://github.com/myrepohubs/test-ai5.git
cd test-ai5
```

### 2. Configurar la base de datos

#### Crear base de datos PostgreSQL:
```sql
CREATE DATABASE test_lite_db5;
CREATE USER test_user WITH ENCRYPTED PASSWORD 'password';
GRANT ALL PRIVILEGES ON DATABASE test_lite_db5 TO test_user;
```

#### Configurar variables de entorno:
- Backend: `backend/.env` (ya configurado)
- Frontend: `frontend/.env.local` (ya configurado)

### 3. Instalar dependencias

#### Instalar dependencias del proyecto principal:
```bash
npm install
```

#### Instalar dependencias del backend:
```bash
cd backend
npm install
```

#### Instalar dependencias del frontend:
```bash
cd ../frontend
npm install
```

### 4. Ejecutar migraciones de base de datos
```bash
cd ../backend
node scripts/migrate.js
```

### 5. Iniciar los servidores

#### Opción 1: Iniciar ambos servidores simultáneamente:
```bash
# Desde la raíz del proyecto
npm run dev
```

#### Opción 2: Iniciar servidores por separado:

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

## 🌐 URLs de Acceso

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **Health Check**: http://localhost:3001/health

## 📁 Estructura del Proyecto

```
test-ai5/
├── backend/                 # API Backend
│   ├── config/             # Configuraciones
│   ├── routes/             # Rutas API
│   ├── scripts/            # Scripts (migraciones)
│   ├── server.js           # Servidor principal
│   └── .env                # Variables de entorno
├── frontend/               # Frontend Next.js
│   ├── src/
│   │   ├── app/           # App Router (Next.js 13+)
│   │   ├── lib/           # Utilidades
│   │   └── components/    # Componentes React
│   ├── package.json
│   └── .env.local         # Variables de entorno
└── package.json           # Configuración principal
```

## 🔧 API Endpoints

### Autenticación
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/register` - Registrar usuario
- `GET /api/auth/verify` - Verificar token

### Inventario
- `GET /api/inventory/products` - Listar productos
- `POST /api/inventory/products` - Crear producto
- `GET /api/inventory/categories` - Listar categorías

### Reportes
- `GET /api/reports/dashboard` - Métricas del dashboard
- `GET /api/reports/inventory` - Reporte de inventario

## 👥 Roles de Usuario

- **Admin**: Acceso completo al sistema
- **Contador**: Acceso a reportes y contabilidad
- **Cajero**: Acceso a ventas y productos

## 🚀 Comandos Útiles

```bash
# Ejecutar migraciones
cd backend && node scripts/migrate.js

# Iniciar en modo desarrollo
npm run dev

# Construir para producción
npm run build

# Iniciar en producción
npm start
```

## 📊 Base de Datos

El sistema incluye las siguientes tablas principales:

- `company_config` - Configuración de la empresa
- `users` - Usuarios del sistema
- `categories` - Categorías de productos
- `products` - Productos
- `suppliers` - Proveedores
- `customers` - Clientes
- `sales` - Ventas
- `purchases` - Compras
- `accounting_entries` - Asientos contables

## 🔐 Seguridad

- Contraseñas encriptadas con bcryptjs
- Tokens JWT para autenticación
- Validación de datos en todas las rutas
- Rate limiting para prevenir ataques
- CORS configurado

## 📈 Desarrollo

### Convenciones de Commits
```
feat: nueva funcionalidad
fix: corrección de bug
docs: documentación
style: cambios de formato
refactor: refactorización
test: pruebas
```

### Flujo de Desarrollo
1. Crear rama desde `main`
2. Desarrollar funcionalidad
3. Commit con mensaje descriptivo
4. Push a GitHub
5. Crear Pull Request

## 🆘 Solución de Problemas

### Error de conexión a base de datos
- Verificar que PostgreSQL esté ejecutándose
- Revisar credenciales en `backend/.env`
- Verificar que la base de datos existe

### Error de dependencias
```bash
# Limpiar e instalar nuevamente
rm -rf node_modules package-lock.json
npm install
```

### Error de puertos
Si el puerto 3000 o 3001 está ocupado:
```bash
# Cambiar puerto en backend/.env
PORT=3002

# O cambiar en frontend/.env.local
NEXT_PUBLIC_API_URL=http://localhost:3002/api
```

## 📞 Soporte

Para soporte técnico o consultas:
- Email: soporte@erp-lite.pe
- GitHub Issues: [Crear issue](https://github.com/myrepohubs/test-ai5/issues)

## 📄 Licencia

MIT License - Ver archivo LICENSE para más detalles.

---

**ERP-Lite Perú** - Sistema ERP para el crecimiento de tu negocio 🚀
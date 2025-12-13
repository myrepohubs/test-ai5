import Link from 'next/link'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold text-center mb-8 text-primary-600">
          ERP-Lite Perú
        </h1>
        <p className="text-center mb-8 text-gray-600">
          Sistema ERP diseñado para PYMES peruanas
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
          <Link href="/dashboard" className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <h3 className="text-lg font-semibold mb-2 text-gray-800">Dashboard</h3>
            <p className="text-gray-600">Panel de control principal con métricas del negocio</p>
          </Link>
          
          <Link href="/inventory" className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <h3 className="text-lg font-semibold mb-2 text-gray-800">Inventario</h3>
            <p className="text-gray-600">Gestión de productos y stock</p>
          </Link>
          
          <Link href="/sales" className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <h3 className="text-lg font-semibold mb-2 text-gray-800">Ventas</h3>
            <p className="text-gray-600">Punto de venta y facturación</p>
          </Link>
          
          <Link href="/purchases" className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <h3 className="text-lg font-semibold mb-2 text-gray-800">Compras</h3>
            <p className="text-gray-600">Gestión de proveedores</p>
          </Link>
          
          <Link href="/accounting" className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <h3 className="text-lg font-semibold mb-2 text-gray-800">Contabilidad</h3>
            <p className="text-gray-600">Asientos contables y reportes financieros</p>
          </Link>
          
          <Link href="/reports" className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <h3 className="text-lg font-semibold mb-2 text-gray-800">Reportes</h3>
            <p className="text-gray-600">Informes de ventas, stock y más</p>
          </Link>
        </div>
      </div>
    </main>
  )
}
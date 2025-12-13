import InventoryList from '@/components/InventoryList';

export default function Inventory() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Inventario</h1>
          <p className="text-gray-600">Administra tus productos y stock</p>
        </div>
        
        <InventoryList />
      </div>
    </div>
  );
}
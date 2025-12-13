import Layout from '@/components/Layout';
import InventoryList from '@/components/InventoryList';

export default function Inventory() {
  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Gestión de Inventario</h1>
        <p className="text-gray-600">Administra tus productos y stock</p>
      </div>
      
      <InventoryList />
    </Layout>
  );
}
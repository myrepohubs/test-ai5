'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Verificar autenticación solo en el cliente
    const checkAuth = () => {
      try {
        const userData = localStorage.getItem('user');
        if (userData) {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
        } else {
          // Solo redirigir si no hay datos de usuario y no estamos ya en login
          if (!window.location.pathname.includes('/login')) {
            router.push('/login');
          }
        }
      } catch (error) {
        console.error('Error checking auth:', error);
        // Limpiar localStorage corrupto
        localStorage.removeItem('user');
        if (!window.location.pathname.includes('/login')) {
          router.push('/login');
        }
      } finally {
        setIsLoading(false);
      }
    };

    // Delay para evitar problemas de hidratación
    const timer = setTimeout(checkAuth, 100);
    return () => clearTimeout(timer);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    router.push('/login');
  };

  const handleNavigation = (href: string) => {
    // Navegación programática para evitar recargas de página
    router.push(href);
  };

  // Mostrar loading solo al inicio
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  // Si no hay usuario, mostrar página de carga en lugar de redirigir inmediatamente
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Verificando sesión...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-xl font-bold text-gray-900">ERP-Lite Perú</h1>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-700">
                <span className="font-medium">{user?.full_name || 'Usuario'}</span>
                <span className="ml-2 px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                  {user?.role || 'usuario'}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            <button
              onClick={() => handleNavigation('/dashboard')}
              className="px-3 py-4 text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              Dashboard
            </button>
            <button
              onClick={() => handleNavigation('/inventory')}
              className="px-3 py-4 text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              Inventario
            </button>
            <button
              onClick={() => handleNavigation('/sales')}
              className="px-3 py-4 text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              Ventas
            </button>
            <button
              onClick={() => handleNavigation('/purchases')}
              className="px-3 py-4 text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              Compras
            </button>
            <button
              onClick={() => handleNavigation('/accounting')}
              className="px-3 py-4 text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              Contabilidad
            </button>
            <button
              onClick={() => handleNavigation('/reports')}
              className="px-3 py-4 text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              Reportes
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}
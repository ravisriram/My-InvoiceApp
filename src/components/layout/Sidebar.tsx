import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  FileText, 
  Calculator, 
  Truck, 
  Users, 
  Package,
  BarChart3,
  Settings
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    {
      icon: BarChart3,
      label: 'Dashboard',
      path: '/',
      active: location.pathname === '/'
    },
    {
      icon: FileText,
      label: 'Invoices',
      path: '/invoices',
      active: location.pathname.startsWith('/invoices')
    },
    {
      icon: Calculator,
      label: 'Estimates',
      path: '/estimates',
      active: location.pathname.startsWith('/estimates')
    },
    {
      icon: Truck,
      label: 'Delivery Notes',
      path: '/delivery-notes',
      active: location.pathname.startsWith('/delivery-notes')
    },
    {
      icon: Users,
      label: 'Customers',
      path: '/customers',
      active: location.pathname.startsWith('/customers')
    },
    {
      icon: Package,
      label: 'Products',
      path: '/products',
      active: location.pathname.startsWith('/products')
    }
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
    onClose();
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:shadow-none lg:border-r lg:border-gray-200
      `}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center space-x-2 p-6 border-b border-gray-200">
            <FileText className="h-8 w-8 text-blue-600" />
            <h1 className="text-xl font-bold text-gray-900">InvoicePro</h1>
          </div>
          
          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.path}
                  onClick={() => handleNavigation(item.path)}
                  className={`
                    w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200
                    ${item.active 
                      ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }
                  `}
                >
                  <Icon className={`h-5 w-5 ${item.active ? 'text-blue-600' : 'text-gray-400'}`} />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </nav>
          
          {/* Settings */}
          <div className="p-4 border-t border-gray-200">
            <button
              onClick={() => handleNavigation('/settings')}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all duration-200"
            >
              <Settings className="h-5 w-5 text-gray-400" />
              <span className="font-medium">Settings</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UserTable from '../components/Tables/UserTable';
import Button from '../components/ui/Button';
import { readToken } from '../api/auth/authService';

const DashboardUser = ({ isSidebarOpen }) => {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState(null);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // Función para leer y actualizar el rol del usuario desde el token
  useEffect(() => {
    const fetchUserRole = async () => {
      const decodedToken = await readToken(); // Asegúrate de que readToken sea una función async
      if (decodedToken?.role?.name) {
        setUserRole(decodedToken.role.name); // Actualiza el rol del usuario si existe en el token
      } else {
        setUserRole(null); // Si no hay rol, lo establece como null
      }
    };

    fetchUserRole();
  }, []);

  // Actualizar el tamaño de la ventana cuando cambia la resolución
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Ajustar margen según la resolución y el estado del sidebar
  const calculateMarginRight = () => {
    if (isSidebarOpen) {
      if (windowWidth >= 1024) {
        return 'lg:pr-24'; // Margen más amplio para pantallas grandes
      }
      return 'pr-16'; // Margen ajustado para pantallas medianas
    }
    return 'pr-6'; // Menor margen si el sidebar está cerrado
  };

  return (
    <div
      className={`w-full max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 transition-all duration-300 ${calculateMarginRight()}`}
    >
      {/* Contenedor flex para alinear título y botón en pantallas grandes */}
      <div className="px-4 sm:px-0 sm:flex sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Gestión de Usuarios</h1>
        {(userRole === 'Administrador' || userRole === 'Superadministrador') && (
          <Button
            onClick={() => navigate('/admin/create-user')}
            className="mt-4 sm:mt-0 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
          >
            Crear Usuario
          </Button>
        )}
      </div>

      <div className="mt-4 sm:mt-6">
        {/* Contenedor de la tabla ajustado */}
        <div className="mt-4 bg-white shadow overflow-hidden sm:rounded-lg max-w-full overflow-x-auto">
          <UserTable />
        </div>
      </div>
    </div>
  );
};

export default DashboardUser;

import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import NavigationBar from './NavigationBar';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      const newIsMobile = window.innerWidth < 768;
      setIsMobile(newIsMobile);
      setSidebarOpen(!newIsMobile);
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Llamar inicialmente para establecer el estado correcto
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <NavigationBar toggleSidebar={toggleSidebar} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} isMobile={isMobile} />
        <main
          className={`flex-1 overflow-auto transition-all duration-300 ${
            sidebarOpen && !isMobile ? 'ml-64' : isMobile ? 'ml-0' : 'ml-16'
          }`}
        >
          <div className="p-4">
            <Outlet context={{ isSidebarOpen: sidebarOpen }} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
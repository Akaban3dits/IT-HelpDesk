import React from 'react';
import { Outlet } from 'react-router-dom';
import NavigationBar from './NavigationBar';

const UserLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#EEF1F8]">
      <NavigationBar showLogo={true} />
      <main className="flex-grow">
        <Outlet />
      </main>
    </div>
  );
};

export default UserLayout;
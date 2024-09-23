import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const Breadcrumb = () => {
    const location = useLocation();
    const pathnames = location.pathname.split('/').filter((x) => x);

    const routeLabels = {
        'home': 'Home',
        'admin': 'Admin',
        'dashboard': 'Dashboard',
        'side': 'Side',
        // Add more routes as needed
    };

    return (
        <nav className="flex" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-3 bg-indigo-900 px-4 py-2 rounded-md">
                {/* Primer enlace fijo a "Admin" */}
                <li className="inline-flex items-center">
                    <Link to="/admin/dashboard" className="text-indigo-200 hover:text-white">
                        Admin
                    </Link>
                </li>

                {/* Mapeo del resto de segmentos sin incluir el primer "Admin" nuevamente */}
                {pathnames.map((name, index) => {
                    // Evita mostrar "admin" si ya se ha mostrado como primer elemento
                    if (name === 'admin') return null;

                    const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
                    const isLast = index === pathnames.length - 1;

                    return (
                        <li key={name} className="inline-flex items-center">
                            <ChevronRight className="w-5 h-5 text-indigo-300 mx-1" />
                            {isLast ? (
                                <span className="text-white font-medium">
                                    {routeLabels[name] || name}
                                </span>
                            ) : (
                                <Link
                                    to={routeTo}
                                    className="text-indigo-200 hover:text-white"
                                >
                                    {routeLabels[name] || name}
                                </Link>
                            )}
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
};

export default Breadcrumb;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = () => {
    console.log('Searching for:', searchQuery);
  };

  const handleCardClick = (section) => {
    if (section === 'Crear Ticket') {
      navigate('/create');
    }
    if (section === 'Historial de Tickets') {
      navigate('/my-history');
    } else {
      console.log(`Navigating to ${section} section`);
    }
  };

  return (
    <div className="min-h-screen bg-indigo-50">
      {/* Hero Section with Search */}
      <div className="relative py-8 md:py-16 px-4">
        <div className="relative max-w-4xl mx-auto text-center z-10">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4 md:mb-8">¿Cómo podemos ayudarte?</h1>
          <div className="flex flex-col sm:flex-row justify-center gap-2 px-4 md:px-0">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar tickets por código, título"
              className="w-full max-w-xl px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              style={{ zIndex: 20 }}
            />
            <button
              onClick={handleSearch}
              type="button"
              className="px-6 py-2 bg-indigo-700 text-white rounded-lg hover:bg-indigo-800 transition-colors sm:w-auto w-full cursor-pointer"
              style={{ zIndex: 20 }}
            >
              Buscar
            </button>
          </div>
        </div>
      </div>

      {/* Sistema de Tickets Section */}
      <div className="max-w-7xl mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 max-w-4xl mx-auto">
          {/* Crear Ticket Card */}
          <button
            onClick={() => handleCardClick('Crear Ticket')}
            className="text-left bg-white p-4 md:p-6 rounded-lg shadow-sm hover:shadow-md transition-all cursor-pointer hover:-translate-y-1 w-full border border-transparent hover:border-gray-200"
          >
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-green-500 rounded-full flex items-center justify-center mb-3 md:mb-4">
                <svg className="w-6 h-6 md:w-8 md:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <h3 className="text-lg md:text-xl font-semibold mb-2">Crear Ticket</h3>
              <p className="text-gray-600 text-sm md:text-base mb-3 md:mb-4 text-center">
                Describe tu problema o solicitud y nuestro equipo te ayudará a resolverlo.
              </p>
              <p className="text-green-500 text-sm md:text-base">Crear nuevo</p>
            </div>
          </button>

          {/* Historial de Tickets Card */}
          <button
            onClick={() => handleCardClick('Historial de Tickets')}
            className="text-left bg-white p-4 md:p-6 rounded-lg shadow-sm hover:shadow-md transition-all cursor-pointer hover:-translate-y-1 w-full border border-transparent hover:border-gray-200"
          >
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-blue-500 rounded-full flex items-center justify-center mb-3 md:mb-4">
                <svg
                  className="w-6 h-6 md:w-8 md:h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
              <h3 className="text-lg md:text-xl font-semibold mb-2">Historial de Tickets</h3>
              <p className="text-gray-600 text-sm md:text-base mb-3 md:mb-4 text-center">
                Revisa el estado y las respuestas de todos tus tickets anteriores.
              </p>
              <p className="text-blue-500 text-sm md:text-base">Ver historial</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
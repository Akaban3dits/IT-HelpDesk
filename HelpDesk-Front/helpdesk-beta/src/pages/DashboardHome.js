import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend, Title } from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
import Button from '../components/ui/Button';
import RecentTicketsTable from '../components/Tables/RecentTicketsTable';
import { readToken } from '../api/auth/authService';
import { getMonthlyTicketCounts, getDailyTicketStatusCounts } from '../api/tickets/ticketService';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend, Title);

const DashboardHome = ({ isSidebarOpen }) => {
    const navigate = useNavigate();
    const [userRole, setUserRole] = useState(null);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [monthlyTicketData, setMonthlyTicketData] = useState({ labels: [], datasets: [] });
    const [statusData, setStatusData] = useState({ labels: [], datasets: [] });

    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);

        const fetchUserRole = async () => {
            try {
                const decodedToken = await readToken();
                setUserRole(decodedToken?.role?.name || null);
            } catch (error) {
                setUserRole(null);
            }
        };

        fetchUserRole();

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const fetchMonthlyData = async () => {
            try {
                const data = await getMonthlyTicketCounts();
                const labels = data.map(item => item.month_name);
                const ticketCounts = data.map(item => item.total_tickets);

                setMonthlyTicketData({
                    labels: labels,
                    datasets: [
                        {
                            label: 'Tickets',
                            data: ticketCounts,
                            backgroundColor: 'rgba(59, 130, 246, 0.5)',
                        },
                    ],
                });
            } catch (error) {
                console.error("Error fetching monthly ticket data:", error);
            }
        };

        fetchMonthlyData();
    }, []);

    useEffect(() => {
        const fetchDailyStatusData = async () => {
            try {
                const data = await getDailyTicketStatusCounts();
                const labels = data.map(item => item.status);
                const ticketCounts = data.map(item => item.total_tickets);

                setStatusData({
                    labels: labels,
                    datasets: [
                        {
                            data: ticketCounts,
                            backgroundColor: ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'],
                        },
                    ],
                });
            } catch (error) {
                console.error("Error fetching daily ticket status data:", error);
            }
        };

        fetchDailyStatusData();
    }, []);

    const calculateMarginRight = () => {
        return isSidebarOpen ? (windowWidth >= 1024 ? 'lg:pr-24' : 'pr-16') : 'pr-6';
    };

    const isAdmin = userRole === 'Administrador' || userRole === 'Superadministrador';

    return (
        <div className={`w-full max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 transition-all duration-300 ${calculateMarginRight()}`}>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* Tarjeta de Últimos 12 meses */}
                <div className="bg-white p-4 rounded-lg shadow">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Últimos 12 meses</h2>
                    <div
                        className={`flex items-center justify-center ${monthlyTicketData.labels.length > 0 ? 'h-[300px]' : 'h-[100px]'
                            }`}
                    >
                        {monthlyTicketData.labels.length > 0 ? (
                            <Bar
                                data={monthlyTicketData}
                                options={{
                                    maintainAspectRatio: false,
                                    scales: {
                                        y: {
                                            ticks: {
                                                precision: 0, // Asegura que los valores sean enteros
                                            },
                                            beginAtZero: true, // Comienza el eje Y en cero
                                        },
                                    },
                                }}
                            />
                        ) : (
                            <div className="text-gray-500 text-sm h-full w-full flex items-center justify-center">
                                No hay datos por mostrar
                            </div>
                        )}
                    </div>
                </div>


                {/* Tarjeta de Estado de Tickets del Día */}
                <div className="bg-white p-4 rounded-lg shadow">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Estado de Tickets del Día</h2>
                    <div
                        className={`flex items-center justify-center ${statusData.labels.length > 0 ? 'h-[300px]' : 'h-[100px]'
                            }`}
                    >
                        {statusData.labels.length > 0 ? (
                            <Pie data={statusData} options={{ maintainAspectRatio: false }} />
                        ) : (
                            <div className="text-gray-500 text-sm h-full w-full flex items-center justify-center">
                                No hay datos por mostrar
                            </div>
                        )}
                    </div>
                </div>
            </div>



            {/* Recent Tickets Table */}
            <div className="bg-white p-4 rounded-lg shadow mb-8">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-gray-900">Tickets Recientes</h2>
                    <Button onClick={() => navigate('/admin/tickets')} variant="ghost">
                        Todos los tickets
                    </Button>
                </div>
                <div className="overflow-x-auto">
                    <RecentTicketsTable />
                </div>
            </div>

            {/* Admin Actions */}
            <div className="flex justify-end">
                <Button
                    onClick={() => navigate('/admin/create-ticket')}
                    variant="primary"
                    className="mr-2"
                >
                    Create Ticket
                </Button>
            </div>
        </div>
    );
};

export default DashboardHome;

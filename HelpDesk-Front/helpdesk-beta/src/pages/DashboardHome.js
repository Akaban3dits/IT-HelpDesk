import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    Tooltip,
    Legend,
    Title
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
import Button from '../components/ui/Button'; // Ajuste correcto para Button
import StatCard from '../components/ui/StatCard'; // Ajuste correcto para StatCard
import RecentTicketsTable from '../components/Tables/RecentTicketsTable'; // Ajuste correcto para RecentTicketsTable
import { readToken } from '../api/auth/authService'; // Ajuste correcto para readToken

// Registrando los componentes de Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend, Title);

const DashboardHome = ({ isSidebarOpen }) => {
    const navigate = useNavigate();
    const [userRole, setUserRole] = useState(null);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);

        const fetchUserRole = async () => {
            try {
                const decodedToken = await readToken(); // Asegúrate de que `readToken` sea una función async
                setUserRole(decodedToken?.role?.name || null); // Establece el rol si existe
            } catch (error) {
                setUserRole(null);
            }
        };

        fetchUserRole(); // Carga el rol del usuario al montar el componente

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const calculateMarginRight = () => {
        return isSidebarOpen ? (windowWidth >= 1024 ? 'lg:pr-24' : 'pr-16') : 'pr-6';
    };

    // Data for BarChart (Tickets Overview)
    const ticketData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
            {
                label: 'Tickets',
                data: [65, 59, 80, 81, 56, 55],
                backgroundColor: 'rgba(59, 130, 246, 0.5)',
            },
        ],
    };

    // Data for PieChart (Ticket Status Distribution)
    const statusData = {
        labels: ['Open', 'In Progress', 'Closed'],
        datasets: [
            {
                data: [30, 45, 25],
                backgroundColor: ['#0088FE', '#00C49F', '#FFBB28'],
            },
        ],
    };

    const recentTickets = [
        { id: 'T-001', title: 'Login issue', status: 'Open', priority: 'High' },
        { id: 'T-002', title: 'Report generation error', status: 'In Progress', priority: 'Medium' },
        { id: 'T-003', title: 'Password reset request', status: 'Closed', priority: 'Low' },
        { id: 'T-004', title: 'Database connection failure', status: 'Open', priority: 'Critical' },
        { id: 'T-005', title: 'UI rendering problem', status: 'In Progress', priority: 'Medium' },
    ];

    const isAdmin = userRole === 'Administrador' || userRole === 'Superadministrador';

    return (
        <div className={`w-full max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 transition-all duration-300 ${calculateMarginRight()}`}>
            <h1 className="text-2xl font-semibold text-gray-900 mb-6">Helpdesk Dashboard</h1>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <StatCard title="Total Tickets" value="1,234" description="+15% from last month" />
                <StatCard title="Open Tickets" value="42" description="-5% from last week" />
                <StatCard title="Avg. Response Time" value="2.5 hours" description="-30 min from last month" />
                <StatCard title="Customer Satisfaction" value="4.7/5" description="+0.2 from last quarter" />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <div className="bg-white p-4 rounded-lg shadow">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Tickets Overview</h2>
                    <div style={{ width: '100%', height: 300 }}>
                        <Bar data={ticketData} options={{ maintainAspectRatio: false }} />
                    </div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Ticket Status Distribution</h2>
                    <div style={{ width: '100%', height: 300 }}>
                        <Pie data={statusData} options={{ maintainAspectRatio: false }} />
                    </div>
                </div>
            </div>

            {/* Recent Tickets Table */}
            <div className="bg-white p-4 rounded-lg shadow mb-8">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-gray-900">Recent Tickets</h2>
                    <Button onClick={() => navigate('/tickets')} variant="ghost">
                        View All Tickets
                    </Button>
                </div>
                <div className="overflow-x-auto">
                    <RecentTicketsTable tickets={recentTickets} />
                </div>
            </div>

            {/* Admin Actions */}
            {isAdmin && (
                <div className="flex justify-end">
                    <Button
                        onClick={() => navigate('/admin/create-ticket')}
                        variant="primary"
                        className="mr-2"
                    >
                        Create Ticket
                    </Button>
                    <Button
                        onClick={() => navigate('/admin/reports')}
                        variant="ghost"
                    >
                        Generate Report
                    </Button>
                </div>
            )}
        </div>
    );
};

export default DashboardHome;

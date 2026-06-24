import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../utils/axiosInstance';
import { toast } from 'react-toastify';
import { assets } from '../assets/assets';

const Dashboard = ({ token }) => {

    const { data: stats, isLoading, isError, error } = useQuery({
        queryKey: ['dashboardStats'],
        queryFn: async () => {
            const response = await axiosInstance.get('/api/admin/dashboard');
            if (response.data.success) {
                return response.data.stats;
            }
            throw new Error(response.data.message);
        }
    });

    if (isLoading) return (
        <div className="flex h-64 items-center justify-center">
            <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
        </div>
    );

    if (isError) {
        toast.error(error.message);
    }

    const statCards = [
        { title: 'Total Revenue', value: `৳ ${stats?.revenue || 0}`, icon: '💰', color: 'bg-emerald-50 text-emerald-600 border-emerald-200' },
        { title: 'Total Orders', value: stats?.orders || 0, icon: '📦', color: 'bg-blue-50 text-blue-600 border-blue-200' },
        { title: 'Total Products', value: stats?.products || 0, icon: '🛍️', color: 'bg-purple-50 text-purple-600 border-purple-200' },
        { title: 'Categories', value: stats?.categories || 0, icon: '📑', color: 'bg-orange-50 text-orange-600 border-orange-200' },
        { title: 'Total Users', value: stats?.users || 0, icon: '👥', color: 'bg-pink-50 text-pink-600 border-pink-200' }
    ];

    return (
        <div className="animate-fade-in w-full">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Dashboard Overview</h1>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-10">
                {statCards.map((card, idx) => (
                    <div key={idx} className="glass p-6 flex flex-col justify-between hover:-translate-y-1 transition-transform duration-300">
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">{card.title}</h3>
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl border ${card.color}`}>
                                {card.icon}
                            </div>
                        </div>
                        <p className="text-3xl font-bold text-gray-800">{card.value}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Placeholder for Recent Orders */}
                <div className="glass p-6">
                    <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-3">Recent Orders</h2>
                    <div className="flex flex-col items-center justify-center py-10 text-gray-400">
                        <svg className="w-16 h-16 mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path></svg>
                        <p>No recent orders found.</p>
                    </div>
                </div>

                {/* Placeholder for System Activity */}
                <div className="glass p-6">
                    <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-3">System Activity</h2>
                    <div className="space-y-4">
                        <div className="flex gap-4 items-center">
                            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                            <p className="text-sm text-gray-600"><span className="font-semibold text-gray-800">Admin Login</span> successful</p>
                            <span className="text-xs text-gray-400 ml-auto">Just now</span>
                        </div>
                        <div className="flex gap-4 items-center">
                            <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                            <p className="text-sm text-gray-600"><span className="font-semibold text-gray-800">System</span> updated</p>
                            <span className="text-xs text-gray-400 ml-auto">1 hour ago</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;

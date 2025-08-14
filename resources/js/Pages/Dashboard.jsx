import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import PostChart from '@/Components/PostChart';

export default function Dashboard({ totalPosts, totalUsers, postsPerMonth }) {
    const [currentDate, setCurrentDate] = useState('');

    useEffect(() => {
        const now = new Date();
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        setCurrentDate(now.toLocaleDateString('id-ID', options));
    }, []);

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Dashboard
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 space-y-6">
                    {/* Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="p-6 bg-white shadow rounded-xl">
                            <h3 className="text-lg font-semibold text-gray-700">Jumlah Postingan</h3>
                            <p className="mt-2 text-3xl font-bold text-blue-600">{totalPosts}</p>
                        </div>

                        <div className="p-6 bg-white shadow rounded-xl">
                            <h3 className="text-lg font-semibold text-gray-700">Jumlah User</h3>
                            <p className="mt-2 text-3xl font-bold text-green-600">{totalUsers}</p>
                        </div>

                        <div className="p-6 bg-white shadow rounded-xl">
                            <h3 className="text-lg font-semibold text-gray-700">Hari & Tanggal</h3>
                            <p className="mt-2 text-xl font-medium text-gray-800">{currentDate}</p>
                        </div>
                    </div>

                    {/* Grafik */}
                    <div className="bg-white p-6 rounded-xl shadow">
                        <h3 className="text-lg font-semibold text-gray-700 mb-4">Grafik Postingan per Bulan</h3>
                        <PostChart postsPerMonth={postsPerMonth} />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

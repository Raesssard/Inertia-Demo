import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function PostChart({ postsPerMonth }) {
    const labels = postsPerMonth.map(item => item.month);
    const dataCounts = postsPerMonth.map(item => item.count);

    const colors = [
        '#EF4444', // red-500
        '#F59E0B', // yellow-500
        '#10B981', // green-500
        '#3B82F6', // blue-500
        '#8B5CF6', // purple-500
        '#EC4899', // pink-500
    ];

    const data = {
        labels: labels,
        datasets: [
            {
                label: 'Jumlah Postingan',
                data: dataCounts,
                backgroundColor: labels.map((_, index) => colors[index % colors.length]),
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Postingan per Bulan',
            },
        },
    };

    return <Bar data={data} options={options} />;
}
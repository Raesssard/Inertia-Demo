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

    const data = {
        labels: labels,
        datasets: [
            {
                label: 'Jumlah Postingan',
                data: dataCounts,
                backgroundColor: '#3B82F6', // Tailwind blue-500
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

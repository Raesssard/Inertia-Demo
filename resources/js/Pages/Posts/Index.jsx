import React, { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage, useForm } from '@inertiajs/react';
import { toast } from 'react-toastify';

export default function Index({ posts = { data: [] }, categories = [] }) {
    const { flash } = usePage().props;
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [sortBy, setSortBy] = useState('latest');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [specificDate, setSpecificDate] = useState('');

    // Tampilkan toast berdasarkan flash message
    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success, { autoClose: 3000 });
        } else if (flash?.error) {
            toast.error(flash.error, { autoClose: 3000 });
        }
    }, [flash]);

    const { delete: destroy } = useForm();
    const handleDelete = (id) => {
        if (confirm('Yakin ingin menghapus postingan ini?')) {
            destroy(`/posts/${id}`);
        }
    };

    // Fungsi untuk menyortir posts
    const sortedPosts = [...posts.data].sort((a, b) => {
        if (sortBy === 'latest') {
            return new Date(b.created_at) - new Date(a.created_at);
        } else if (sortBy === 'title') {
            return a.title.localeCompare(b.title);
        }
        return 0;
    });

    // Fungsi untuk memformat tanggal
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    // Filter berdasarkan pencarian, kategori, dan tanggal
    const filteredPosts = sortedPosts.filter((post) => {
        const matchesSearch = post?.title?.toLowerCase().includes(searchTerm.toLowerCase()) || false;
        const matchesCategory = !selectedCategory || post?.category_id === parseInt(selectedCategory);

        // Filter berdasarkan rentang tanggal
        const postDate = new Date(post.created_at);
        const isWithinRange = !startDate || !endDate || (postDate >= new Date(startDate) && postDate <= new Date(endDate));
        // Filter berdasarkan tanggal pasti
        const matchesSpecificDate = !specificDate || postDate.toDateString() === new Date(specificDate).toDateString();

        return matchesSearch && matchesCategory && isWithinRange && matchesSpecificDate;
    });

    // Fungsi reset filter
    const handleResetFilter = () => {
        setSearchTerm('');
        setSelectedCategory('');
        setSortBy('latest');
        setStartDate('');
        setEndDate('');
        setSpecificDate('');
    };

    console.log('Posts props:', posts);
    console.log('Flash props:', flash);

    if (!posts || typeof posts.data === 'undefined') {
        return (
            <AuthenticatedLayout>
                <div className="text-center py-12">Loading or error occurred...</div>
            </AuthenticatedLayout>
        );
    }

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center w-full">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">Daftar Postingan</h2>
                    <Link
                        href="/posts/create"
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-700 hover:shadow-lg transition duration-200"
                    >
                        + Buat Postingan
                    </Link>
                </div>
            }
        >
            <Head title="Posts" />

            <div className="py-12 bg-gray-100 min-h-screen">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="mb-6 flex flex-wrap gap-4 items-center">
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Cari berdasarkan judul..."
                            className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Semua Kategori</option>
                            {categories.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="latest">Terbaru</option>
                            <option value="title">Judul</option>
                        </select>
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                            onClick={handleResetFilter}
                            className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition duration-200"
                        >
                            Reset Filter
                        </button>
                    </div>

                    {filteredPosts.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                            {filteredPosts.map((post) => (
                                <div
                                    key={post.id}
                                    className="bg-white rounded shadow hover:shadow-lg transition-all duration-200 overflow-hidden flex flex-col justify-between h-full"
                                >
                                    <Link href={`/posts/${post.id}`} className="flex-1">
                                        {post.image && (
                                            <img
                                                src={`/storage/${post.image}`}
                                                alt={post.title}
                                                className="w-full h-48 object-cover"
                                                loading="lazy"
                                            />
                                        )}
                                        <div className="p-4 flex-1">
                                            <h3 className="font-semibold text-lg text-gray-800 line-clamp-1">
                                                {post.title}
                                            </h3>
                                            <p className="text-gray-600 text-sm line-clamp-2">
                                                {post.content}
                                            </p>
                                            <p className="text-xs text-gray-500 mt-2">
                                                Kategori: {post.category?.name ?? '-'}
                                            </p>
                                            <p className="text-xs text-gray-500 mt-1">
                                                Dibuat: {formatDate(post.created_at)}
                                            </p>
                                        </div>
                                    </Link>
                                    <div className="mt-auto px-4 pb-4">
                                        <div className="flex gap-2">
                                            <Link
                                                href={`/posts/${post.id}/edit`}
                                                className="bg-yellow-500 text-white px-3 py-1 rounded text-sm hover:bg-yellow-600 transition"
                                            >
                                                Edit
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(post.id)}
                                                className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition"
                                            >
                                                Hapus
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center text-gray-500 py-10">
                            Tidak ada postingan yang sesuai.
                        </div>
                    )}

                    {posts.data.length > 0 && posts.links && (
                        <div className="mt-6 flex justify-center">
                            <nav aria-label="Pagination">
                                <ul className="flex items-center gap-2">
                                    {posts.links.map((link, index) => (
                                        <li key={index}>
                                            <Link
                                                href={link.url || '#'}
                                                className={`px-3 py-2 rounded-lg ${link.active ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'} hover:bg-blue-700 hover:text-white transition`}
                                                dangerouslySetInnerHTML={{ __html: link.label || '' }}
                                            />
                                        </li>
                                    ))}
                                </ul>
                            </nav>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
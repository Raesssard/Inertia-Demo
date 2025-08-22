import React, { useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage, useForm } from '@inertiajs/react';
import { toast } from 'react-toastify';

export default function Index({ posts = { data: [] }, categories = [] }) {
    const { flash, auth, filters } = usePage().props;
    const { data: formData, setData, get, reset } = useForm({
        search: filters.search || '',
        category_id: filters.category_id || '',
        sort_by: filters.sort_by || 'latest',
        start_date: filters.start_date || '',
        end_date: filters.end_date || '',
    });

    // Sinkronkan state dengan filters saat halaman dimuat atau berubah
    useEffect(() => {
        setData({
            search: filters.search || '',
            category_id: filters.category_id || '',
            sort_by: filters.sort_by || 'latest',
            start_date: filters.start_date || '',
            end_date: filters.end_date || '',
        });
    }, [filters]);

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

    // Fungsi untuk memformat tanggal
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    // Handle filter change
    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setData(name, value, () => {
            get('/posts', {
                preserveState: true,
                preserveScroll: true,
                data: { ...formData, [name]: value }, // Pastikan parameter dikirim
            }, {
                headers: { 'X-Inertia': true }, // Pastikan Inertia mengenali request
            });
        });
    };

    // Fungsi Set filter
    const handleSetFilter = () => {
        reset();
        get('/posts', {
            preserveState: true,
            preserveScroll: true,
        });
    };

    

    console.log('Posts props:', posts);
    console.log('Filters from props:', filters);
    console.log('Form Data:', formData);

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
                        className="bg-blue-300 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-700 hover:shadow-lg transition duration-200"
                    >
                        + Buat Postingan
                    </Link>
                </div>
            }
        >
            <Head title="Posts" />

            <div className="py-12 bg-gray-100 min-h-screen">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="p-4 bg-gray-200 text-white-700 rounded text-sm mb-5">
                        * Fitur Filter sedang dalam pengembangan, harap tunggu update terbaru.
                    </div>
                    <div className="mb-6 flex flex-wrap gap-4 items-center">
                        <input
                            type="text"
                            name="search"
                            value={formData.search}
                            onChange={handleFilterChange}
                            placeholder="Cari berdasarkan judul..."
                            className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                        <select
                            name="category_id"
                            value={formData.category_id}
                            onChange={handleFilterChange}
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
                            name="sort_by"
                            value={formData.sort_by}
                            onChange={handleFilterChange}
                            className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="latest">Terbaru</option>
                            <option value="title">Judul</option>
                        </select>
                        <input
                            type="date"
                            name="start_date"
                            value={formData.start_date}
                            onChange={handleFilterChange}
                            className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                        <input
                            type="date"
                            name="end_date"
                            value={formData.end_date}
                            onChange={handleFilterChange}
                            className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                            onClick={handleSetFilter}
                            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition duration-200"
                        >
                           Search
                        </button>
                    </div>

                    {posts.data.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                            {posts.data.map((post) => (
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
                                            <p className="text-xs text-gray-500 mt-1">
                                                Oleh: {post.user?.name ?? 'Pengguna Tidak Diketahui'}
                                            </p>
                                        </div>
                                    </Link>
                                    <div className="mt-auto px-4 pb-4">
                                        <div className="flex gap-2">
                                            {auth.user?.id === post.user_id && (
                                                <>
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
                                                </>
                                            )}
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
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, usePage, useForm } from '@inertiajs/react';
import { useEffect } from 'react';
import { toast } from 'react-toastify';

export default function Index({ categories = { data: [] }, filters = {} }) {
    const { flash, auth } = usePage().props;
    const { data: formData, setData, get } = useForm({
        search: filters.search || '',
    });

    // Sinkronkan state dengan filters dari props
    useEffect(() => {
        setData({
            search: filters.search || '',
        });
    }, [filters.search]);

    // Tampilkan toast berdasarkan flash message
    useEffect(() => {
        if (flash?.error) {
            toast.error(flash.error, { autoClose: 3000 });
        } else if (flash?.success) {
            toast.success(flash.success, { autoClose: 3000 });
        }
    }, [flash]);

    const handleDelete = (id) => {
        if (window.confirm('Apakah Anda yakin ingin menghapus kategori ini?')) {
            const category = categories.data.find(cat => cat.id === id);
            if (category && category.posts_count > 0) {
                toast.error('Kategori ini tidak dapat dihapus karena sedang digunakan.', { autoClose: 3000 });
                return;
            }
            router.delete(`/categories/${id}`, {
                preserveScroll: true,
                onError: (errors) => {
                    const errorMsg = errors?.message || 'Gagal menghapus kategori.';
                    toast.error(errorMsg, { autoClose: 3000 });
                },
            });
        }
    };

    // Fungsi untuk terapkan filter (search)
    const handleSetFilter = () => {
        get('/categories', {
            preserveState: true,
            preserveScroll: true,
            data: { search: formData.search },
        });
    };

    // Fungsi reset filter
    const handleResetFilter = () => {
        setData({
            search: '',
        }, () => {
            get('/categories', {
                preserveState: true,
                preserveScroll: true,
            });
        });
    };

    // Gunakan data langsung dari categories (backend sudah filter)
    const filteredCategories = Array.isArray(categories.data) ? categories.data : [];

    // Debug props
    console.log('Categories props:', categories);
    console.log('Auth props:', auth);
    console.log('Form Data:', formData);
    console.log('Filters props:', filters);

    // Fallback jika categories tidak valid
    if (!categories || !categories.data || !Array.isArray(categories.data)) {
        return (
            <AuthenticatedLayout header={<h2 className="font-semibold text-xl">Kategori</h2>}>
                <div className="text-center py-12">Loading or error occurred...</div>
            </AuthenticatedLayout>
        );
    }

    return (
        <AuthenticatedLayout header={<h2 className="font-semibold text-xl">Kategori</h2>}>
            <Head title="Kategori" />

            <div className="mt-6 p-6 bg-white shadow rounded-xl max-w-4xl mx-auto space-y-4">
                <div className="p-4 bg-gray-100 text-white-700 rounded text-sm">
                    * Kategori yang sedang dipakai tidak bisa diedit
                </div>
                <div className="p-4 bg-gray-100 text-white-700 rounded text-sm">
                    * Hanya pembuat Situs yang dapat Edit dan Hapus Kategori, jika ada usulan Hubungi "nfelisx@gmail.com"
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
                    <input
                        type="text"
                        name="search"
                        value={formData.search}
                        onChange={(e) => setData('search', e.target.value)}
                        placeholder="Cari kategori..."
                        className="w-full sm:w-auto p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    <div className="flex gap-2">
                        <button
                            onClick={handleSetFilter}
                            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700 text-sm"
                        >
                            Search
                        </button>
                        <button
                            onClick={handleResetFilter}
                            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-700 text-sm"
                        >
                            Reset Filter
                        </button>
                        <Link
                            href="/categories/create"
                            className="px-4 py-2 bg-blue-300 text-white rounded hover:bg-blue-700 text-sm"
                        >
                            + Tambah Kategori
                        </Link>
                    </div>
                </div>

                <table className="w-full table-auto border-collapse">
                    <thead>
                        <tr className="bg-gray-100 text-left text-sm">
                            <th className="px-4 py-2 border-b">#</th>
                            <th className="px-4 py-2 border-b">Nama Kategori</th>
                            <th className="px-4 py-2 border-b text-right">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredCategories.map((cat, index) => {
                            const globalIndex = ((categories.current_page - 1) * categories.per_page) + (index + 1);
                            const isUsed = cat.posts_count > 0;
                            const rowClass = isUsed ? 'bg-gray-200' : 'hover:bg-gray-50';

                            return (
                                <tr key={cat.id} className={`text-sm ${rowClass}`}>
                                    <td className="px-4 py-2 border-b">{globalIndex}</td>
                                    <td className="px-4 py-2 border-b">{cat.name}</td>
                                    <td className="px-4 py-2 border-b text-right">
                                        <div className="flex justify-end gap-2">
                                            {!isUsed ? (
                                                auth.user?.id === 1 ? (
                                                    <Link
                                                        href={`/categories/${cat.id}/edit`}
                                                        className="bg-yellow-500 text-white px-3 py-1 rounded text-sm hover:bg-yellow-600"
                                                    >
                                                        Edit
                                                    </Link>
                                                ) : (
                                                    <button
                                                        className="bg-yellow-500 text-white px-3 py-1 rounded text-sm opacity-50 cursor-not-allowed"
                                                        disabled
                                                    >
                                                        Edit
                                                    </button>
                                                )
                                            ) : (
                                                <button
                                                    className="bg-yellow-500 text-white px-3 py-1 rounded text-sm opacity-50 cursor-not-allowed"
                                                    disabled
                                                >
                                                    Edit
                                                </button>
                                            )}
                                            {auth.user?.id === 1 ? (
                                                <button
                                                    onClick={() => handleDelete(cat.id)}
                                                    className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                                                >
                                                    Hapus
                                                </button>
                                            ) : (
                                                <button
                                                    className="bg-red-600 text-white px-3 py-1 rounded text-sm opacity-50 cursor-not-allowed"
                                                    disabled
                                                >
                                                    Hapus
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                        {filteredCategories.length === 0 && (
                            <tr>
                                <td colSpan="3" className="text-center py-4 text-gray-500">
                                    {formData.search ? 'Tidak ada kategori yang sesuai.' : 'Belum ada kategori.'}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>

                {/* Pagination */}
                {categories.data.length > 0 && categories.links && (
                    <div className="mt-6 flex justify-center">
                        <nav aria-label="Pagination">
                            <ul className="flex items-center gap-2">
                                {categories.links.map((link, index) => (
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
        </AuthenticatedLayout>
    );
}
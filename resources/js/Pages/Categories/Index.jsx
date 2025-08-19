import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react'; // Tambahkan useEffect di sini
import { toast } from 'react-toastify';

export default function Index({ categories = { data: [] } }) {
    const { flash } = usePage().props;
    const [searchTerm, setSearchTerm] = useState('');

    // Tampilkan toast berdasarkan flash message
    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success, { autoClose: 3000 });
        } else if (flash?.error) {
            toast.error(flash.error, { autoClose: 3000 });
        } else if (flash?.message) { // Handle jika flash.message digunakan
            toast.success(flash.message, { autoClose: 3000 });
        }
    }, [flash]);

    const handleDelete = (id) => {
        if (window.confirm('Apakah Anda yakin ingin menghapus kategori ini?')) {
            router.delete(`/categories/${id}`, {
                onSuccess: () => {
                    toast.success('Kategori berhasil dihapus', { autoClose: 3000 });
                },
                onError: (errors) => {
                    const errorMsg = errors?.message || 'Kategori sedang digunakan';
                    toast.error(`Gagal menghapus kategori: ${errorMsg}`, { autoClose: 3000 });
                },
            });
        }
    };

    // Filter kategori berdasarkan pencarian
    const filteredCategories = Array.isArray(categories.data)
        ? categories.data.filter((cat) => cat?.name?.toLowerCase().includes(searchTerm.toLowerCase()))
        : [];

    // Debug props
    console.log('Categories props:', categories);
    console.log('Flash props:', flash);

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
                <div className="p-4 bg-yellow-100 text-yellow-700 rounded text-sm">
                    * Kategori yang sedang dipakai tidak bisa dihapus
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Cari kategori..."
                        className="w-full sm:w-auto p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    <Link
                        href="/categories/create"
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                    >
                        + Tambah Kategori
                    </Link>
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
                        {filteredCategories.map((cat, index) => (
                            <tr key={cat.id} className="hover:bg-gray-50 text-sm">
                                <td className="px-4 py-2 border-b">{index + 1}</td>
                                <td className="px-4 py-2 border-b">{cat.name}</td>
                                <td className="px-4 py-2 border-b text-right">
                                    <div className="flex justify-end gap-2">
                                        <Link
                                            href={`/categories/${cat.id}/edit`}
                                            className="bg-yellow-500 text-white px-3 py-1 rounded text-sm hover:bg-yellow-600"
                                        >
                                            Edit
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(cat.id)}
                                            className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                                        >
                                            Hapus
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {filteredCategories.length === 0 && (
                            <tr>
                                <td colSpan="3" className="text-center py-4 text-gray-500">
                                    {searchTerm ? 'Tidak ada kategori yang sesuai.' : 'Belum ada kategori.'}
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
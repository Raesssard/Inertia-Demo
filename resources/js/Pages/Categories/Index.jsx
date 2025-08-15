import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';

export default function Index({ categories }) {
    const handleDelete = (id) => {
        if (window.confirm('Apakah Anda yakin ingin menghapus kategori ini?')) {
            router.delete(`/categories/${id}`, {
                onSuccess: () => {
                    console.log('Kategori berhasil dihapus');
                },
                onError: (errors) => {
                    console.log('Gagal menghapus kategori:', errors);
                    alert('Kategori tidak bisa dihapus karena sedang digunakan.');
                },
            });
        }
    };

    return (
        <AuthenticatedLayout header={<h2 className="font-semibold text-xl">Kategori</h2>}>
            <Head title="Kategori" />

            <div className="mt-6 p-6 bg-white shadow rounded-xl max-w-4xl mx-auto space-y-4">
                {/* Peringatan statis */}
                <div className="p-4 bg-yellow-100 text-yellow-700 rounded text-sm">
                    * Kategori yang sedang dipakai tidak bisa dihapus
                </div>

                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Daftar Kategori</h3>
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
                        {categories.map((cat, index) => (
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
                        {categories.length === 0 && (
                            <tr>
                                <td colSpan="3" className="text-center py-4 text-gray-500">
                                    Belum ada kategori.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </AuthenticatedLayout>
    );
}
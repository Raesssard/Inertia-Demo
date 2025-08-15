import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link } from '@inertiajs/react';

export default function Edit({ category = null }) {
    const { data, setData, put, processing, errors } = useForm({
        name: category?.name || ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(`/categories/${category.id}`);
    };

    // Fallback jika category undefined
    if (!category) {
        return (
            <AuthenticatedLayout>
                <div className="text-center py-12">Loading...</div>
            </AuthenticatedLayout>
        );
    }

    // Debug untuk memastikan category ada
    console.log('Category in Edit:', category);

    return (
        <AuthenticatedLayout header={<h2 className="font-semibold text-xl">Edit Kategori</h2>}>
            <Head title="Edit" />

            <form onSubmit={handleSubmit} className="max-w-md p-6 mt-6 bg-white shadow rounded-xl space-y-4 mx-auto">
                <div>
                    <label className="block font-medium">Nama Kategori</label>
                    <input
                        type="text"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        className="w-full border rounded px-3 py-2"
                    />
                    {errors.name && <p className="text-red-600">{errors.name}</p>}
                </div>
                <div className="flex gap-2">
                    <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                        disabled={processing}
                    >
                        Update
                    </button>
                    <Link
                        href="/categories"
                        className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400 transition"
                    >
                        Batal
                    </Link>
                </div>
            </form>
        </AuthenticatedLayout>
    );
}
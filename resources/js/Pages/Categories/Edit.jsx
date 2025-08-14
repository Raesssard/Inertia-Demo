import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';

export default function Create({ category = null }) {
    const { data, setData, post, put, processing, errors } = useForm({
        name: category?.name || ''
    });

    const handleSubmit = e => {
        e.preventDefault();
        category
            ? put(`/categories/${category.id}`)
            : post('/categories');
    };

    return (
        <AuthenticatedLayout header={<h2 className="font-semibold text-xl">{category ? 'Edit' : 'Tambah'} Kategori</h2>}>
            <Head title={category ? 'Edit' : 'Tambah'} />

            <form onSubmit={handleSubmit} className="max-w-md p-6 mt-6 bg-white shadow rounded-xl space-y-4 mx-auto">
                <div>
                    <label className="block font-medium">Nama Kategori</label>
                    <input
                        type="text"
                        value={data.name}
                        onChange={e => setData('name', e.target.value)}
                        className="w-full border rounded px-3 py-2"
                    />
                    {errors.name && <p className="text-red-600">{errors.name}</p>}
                </div>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded" disabled={processing}>
                    {category ? 'Update' : 'Simpan'}
                </button>
            </form>
        </AuthenticatedLayout>
    );
}

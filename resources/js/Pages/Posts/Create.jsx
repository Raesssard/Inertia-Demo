import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link } from '@inertiajs/react';

export default function Create({ categories }) {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        content: '',
        category_id: '',
        image: null,
        new_category_name: '', // State untuk nama kategori baru
    });

    const [preview, setPreview] = useState(null);
    const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setData('image', file);
        if (file) {
            setPreview(URL.createObjectURL(file));
        } else {
            setPreview(null);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/posts', {
            forceFormData: true,
            onSuccess: () => {},
            onError: (errors) => {},
        });
    };

    // Fallback jika categories undefined
    if (!categories) {
        return (
            <AuthenticatedLayout>
                <div className="text-center py-12">Loading...</div>
            </AuthenticatedLayout>
        );
    }

    return (
        <AuthenticatedLayout
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Tambah Postingan</h2>}
        >
            <Head title="Tambah Postingan" />

            <div className="py-12">
                <div className="max-w-2xl mx-auto sm:px-6 lg:px-8">
                    <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-6 bg-white p-6 rounded shadow">
                        <div>
                            <label className="block mb-1 font-semibold text-gray-700">Judul</label>
                            <input
                                type="text"
                                value={data.title}
                                onChange={(e) => setData('title', e.target.value)}
                                className="w-full border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-500"
                            />
                            {errors.title && <div className="text-red-600 text-sm mt-1">{errors.title}</div>}
                        </div>

                        <div>
                            <label className="block mb-1 font-semibold text-gray-700">Konten</label>
                            <textarea
                                value={data.content}
                                onChange={(e) => setData('content', e.target.value)}
                                className="w-full border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-500"
                                rows="4"
                            />
                            {errors.content && <div className="text-red-600 text-sm mt-1">{errors.content}</div>}
                        </div>

                        <div>
                            <label className="block mb-1 font-semibold text-gray-700">Kategori</label>
                            <div className="relative">
                                <select
                                    value={data.category_id}
                                    onChange={(e) => {
                                        if (e.target.value === 'new') {
                                            setShowNewCategoryInput(true);
                                            setData('category_id', '');
                                        } else {
                                            setShowNewCategoryInput(false);
                                            setData('category_id', e.target.value);
                                        }
                                    }}
                                    className="w-full border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-500"
                                >
                                    <option value="">-- Pilih Kategori --</option>
                                    {categories.map((category) => (
                                        <option key={category.id} value={category.id}>
                                            {category.name}
                                        </option>
                                    ))}
                                    <option value="new">+ Tambah Kategori Baru</option>
                                </select>
                                {showNewCategoryInput && (
                                    <input
                                        type="text"
                                        value={data.new_category_name}
                                        onChange={(e) => setData('new_category_name', e.target.value)}
                                        placeholder="Masukkan nama kategori baru..."
                                        className="w-full mt-2 border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-500"
                                    />
                                )}
                            </div>
                            {errors.category_id && <div className="text-red-600 text-sm mt-1">{errors.category_id}</div>}
                            {errors.new_category_name && <div className="text-red-600 text-sm mt-1">{errors.new_category_name}</div>}
                        </div>

                        <div>
                            <label className="block mb-1 font-semibold text-gray-700">Gambar (opsional)</label>
                            <input
                                type="file"
                                onChange={handleImageChange}
                                className="w-full border-gray-300 rounded-lg p-2"
                                accept="image/*"
                            />
                            {preview && (
                                <img src={preview} alt="Preview" className="mt-2 w-40 h-24 object-cover rounded" />
                            )}
                            {errors.image && <div className="text-red-600 text-sm mt-1">{errors.image}</div>}
                        </div>

                        <div className="flex gap-2">
                            <button
                                type="submit"
                                disabled={processing}
                                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                            >
                                Simpan
                            </button>
                            <Link
                                href="/posts"
                                className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400 transition"
                            >
                                Batal
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
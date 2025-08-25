import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, usePage, Link } from '@inertiajs/react';

export default function Edit({ post, categories, page }) {
    const { errors } = usePage().props;

    // Fallback jika post atau categories undefined
    if (!post || !categories) {
        return (
            <AuthenticatedLayout>
                <div className="text-center py-12">Loading...</div>
            </AuthenticatedLayout>
        );
    }

    const { data, setData, post: submit, processing } = useForm({
        _method: 'put',
        title: post.title || '',
        content: post.content || '',
        category_id: post.category_id || '',
        image: null,
    });

    const [preview, setPreview] = useState(post.image ? `/storage/${post.image}` : null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setData('image', file);
        if (file) {
            setPreview(URL.createObjectURL(file));
        } else {
            setPreview(post.image ? `/storage/${post.image}` : null);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        submit(`/posts/${post.id}`, {
            forceFormData: true,
            onSuccess: () => {
                // Kembali ke halaman sebelumnya setelah sukses
                window.location.href = page ? `/posts?page=${page}` : '/posts';
            },
        });
    };

    // URL kembali ke halaman sebelumnya dengan parameter page
    const backUrl = page ? `/posts?page=${page}` : '/posts';

    return (
        <AuthenticatedLayout
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Edit Postingan</h2>}
        >
            <Head title={`Edit - ${post.title || 'Postingan'}`} />

            <div className="py-12">
                <div className="max-w-2xl mx-auto sm:px-6 lg:px-8">
                    <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-6 bg-white p-6 rounded shadow">
                        <div>
                            <label className="block mb-1 font-semibold">Judul</label>
                            <input
                                type="text"
                                value={data.title}
                                onChange={e => setData('title', e.target.value)}
                                className="w-full border p-2 rounded"
                            />
                            {errors.title && <div className="text-red-600 text-sm">{errors.title}</div>}
                        </div>

                        <div>
                            <label className="block mb-1 font-semibold">Konten</label>
                            <textarea
                                value={data.content}
                                onChange={e => setData('content', e.target.value)}
                                className="w-full border p-2 rounded"
                                rows="4"
                            />
                            {errors.content && <div className="text-red-600 text-sm">{errors.content}</div>}
                        </div>

                        <div>
                            <label className="block mb-1 font-semibold">Kategori</label>
                            <select
                                value={data.category_id}
                                onChange={e => setData('category_id', parseInt(e.target.value) || '')}
                                className="w-full border p-2 rounded"
                            >
                                <option value="">-- Pilih Kategori --</option>
                                {categories.map(category => (
                                    <option key={category.id} value={category.id}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                            {errors.category_id && <div className="text-red-600 text-sm">{errors.category_id}</div>}
                        </div>

                        <div>
                            <label className="block mb-1 font-semibold">Gambar (opsional)</label>
                            <input
                                type="file"
                                onChange={handleImageChange}
                                className="w-full"
                                accept="image/*"
                            />
                            {preview && (
                                <img src={preview} alt="Preview" className="mt-2 w-40 h-24 object-cover rounded" />
                            )}
                            {errors.image && <div className="text-red-600 text-sm">{errors.image}</div>}
                        </div>

                        <div className="flex gap-2">
                            <button
                                type="submit"
                                disabled={processing}
                                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                            >
                                Simpan Perubahan
                            </button>
                            <Link
                                href={backUrl}
                                className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
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
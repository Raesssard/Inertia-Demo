import React, { useState } from 'react';
import { useForm, usePage, Link } from '@inertiajs/react';

export default function Edit({ post, categories }) {
    const { errors } = usePage().props;

    const { data, setData, post: submit, processing } = useForm({
        _method: 'put', // override method karena pakai POST
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
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        submit(`/posts/${post.id}`, {
            forceFormData: true, // ⬅️ penting untuk kirim file dan menjaga data agar tidak dikonversi otomatis
        });
    };

    return (
        <div className="max-w-2xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Edit Post</h1>

            <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-4">
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
                        href="/posts"
                        className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
                    >
                        Batal
                    </Link>
                </div>
            </form>
        </div>
    );
}

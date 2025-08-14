import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Index({ posts, success }) {
    const { delete: destroy } = useForm();

    const handleDelete = (id) => {
        if (confirm('Yakin ingin menghapus postingan ini?')) {
            destroy(`/posts/${id}`, {
                onSuccess: () => {}, // Placeholder untuk callback
                onError: () => {},  // Placeholder untuk callback
            });
        }
    };

    // Fallback jika posts undefined
    if (!posts) {
        return (
            <AuthenticatedLayout>
                <div className="text-center py-12">Loading...</div>
            </AuthenticatedLayout>
        );
    }

    return (
        <AuthenticatedLayout
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Daftar Postingan</h2>}
        >
            <Head title="Posts" />

            <div className="py-12 bg-gray-100 min-h-screen">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {success && (
                        <div className="mb-4 p-2 bg-green-100 text-green-700 rounded">
                            {success}
                        </div>
                    )}

                    <div className="flex justify-end mb-4">
                        <Link
                            href="/posts/create"
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                        >
                            + Buat Postingan
                        </Link>
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
                                                loading="lazy" // Optimasi lazy loading
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
                            Belum ada postingan.
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
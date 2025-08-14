import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Show({ post }) {
    return (
        <AuthenticatedLayout
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Detail Postingan</h2>}
        >
            <Head title={`Detail - ${post.title}`} />

            <div className="py-12 bg-gray-100 min-h-screen">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white shadow rounded-lg overflow-hidden">
                        {post.image && (
                            <img
                                src={`/storage/${post.image}`}
                                alt={post.title}
                                className="w-full h-96 object-contain bg-black"
                            />
                        )}

                        <div className="p-6">
                            <h1 className="text-2xl font-bold text-gray-800 mb-2">{post.title}</h1>
                            <p className="text-sm text-gray-500 mb-4">
                                Kategori: <span className="font-medium">{post.category?.name ?? '-'}</span>
                            </p>
                            <p className="text-gray-700 whitespace-pre-line">
                                {post.content}
                            </p>

                            <div className="mt-6">
                                <Link
                                    href="/posts"
                                    className="inline-block bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
                                >
                                    ← Kembali ke daftar
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

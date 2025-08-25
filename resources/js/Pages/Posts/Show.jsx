import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';

export default function Show({ post, page }) {
    // Fallback jika post undefined
    if (!post) {
        return (
            <AuthenticatedLayout>
                <div className="text-center py-12">Loading...</div>
            </AuthenticatedLayout>
        );
    }

    // Fungsi untuk memformat tanggal
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    // URL kembali ke halaman sebelumnya dengan parameter page
    const backUrl = page ? `/posts?page=${page}` : '/posts';

    return (
        <AuthenticatedLayout
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Detail Postingan</h2>}
        >
            <Head title={`Detail - ${post.title || 'Postingan'}`} />

            <div className="py-12 bg-gray-100 min-h-screen">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white shadow rounded-lg overflow-hidden transition-all duration-200">
                        {post.image && (
                            <img
                                src={`/storage/${post.image}`}
                                alt={post.title}
                                className="w-full h-96 object-contain bg-gray-200"
                                loading="lazy"
                            />
                        )}

                        <div className="p-6">
                            <h1 className="text-2xl font-bold text-gray-800 mb-2">
                                {post.title || 'Judul Tidak Tersedia'}
                            </h1>
                            <p className="text-sm text-gray-500 mb-2">
                                Kategori:{' '}
                                <span className="font-medium">{post.category?.name ?? '-'}</span>
                            </p>
                            <p className="text-xs text-gray-500 mb-2">
                                Dibuat: {formatDate(post.created_at)}
                            </p>
                            <p className="text-xs text-gray-500 mb-2">
                                Oleh: {post.user?.name ?? 'Pengguna Tidak Diketahui'}
                            </p>
                            <p className="text-gray-700 whitespace-pre-line">
                                {post.content || 'Konten tidak tersedia'}
                            </p>

                            <div className="mt-6">
                                <Link
                                    href={backUrl}
                                    className="inline-block bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition"
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
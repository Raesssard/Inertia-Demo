<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CategoryController extends Controller
{
    public function index()
    {
        $categories = Category::withCount('posts')->latest()->paginate(15);
        return Inertia::render('Categories/Index', compact('categories'));
    }

    public function create()
    {
        return Inertia::render('Categories/Create');
    }

    public function store(Request $request)
    {
        $request->validate(['name' => 'required']);
        Category::create($request->only('name'));
        return redirect('/categories')->with('flash', ['success' => 'Kategori berhasil dibuat.']);
    }

    public function edit(Category $category)
    {
        return Inertia::render('Categories/Edit', compact('category'));
    }

    public function update(Request $request, Category $category)
    {
        $request->validate(['name' => 'required']);
        $category->update($request->only('name'));
        return redirect('/categories')->with('flash', ['success' => 'Kategori berhasil diperbarui.']);
    }

    public function destroy(Category $category)
    {
        try {
            // Cek apakah kategori digunakan oleh postingan
            if ($category->posts()->exists()) {
                return redirect('/categories')
                    ->with('flash', ['error' => 'Kategori tidak bisa dihapus karena sedang digunakan oleh postingan.']);
            }

            $category->delete();
            return redirect('/categories')->with('flash', ['success' => 'Kategori berhasil dihapus.']);
        } catch (\Exception $e) {
            return redirect('/categories')
                ->with('flash', ['error' => 'Terjadi kesalahan saat menghapus kategori: ' . $e->getMessage()]);
        }
    }
}
<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class CategoryController extends Controller
{
    public function index(Request $request)
    {
        $query = Category::withCount('posts');

        if ($request->filled('search')) {
            $query->where('name', 'like', "%{$request->search}%");
        }

        $categories = $query->paginate(10)->withQueryString();

        return Inertia::render('Categories/Index', [
            'categories' => $categories,
            'filters' => $request->only('search'), // Tambahkan ini
        ]);
    }

    public function create()
    {
        return Inertia::render('Categories/Create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:categories,name',
        ]);

        Category::create($request->only('name'));
        return redirect('/categories')->with('flash', ['success' => 'Kategori berhasil ditambahkan.']);
    }

    public function edit(Category $category)
    {
        if (auth::id() !== 1) {
            return redirect('/categories')->with('flash', ['error' => 'Anda tidak memiliki izin untuk mengedit kategori.']);
        }
        return Inertia::render('Categories/Edit', [
            'category' => $category,
        ]);
    }

    public function update(Request $request, Category $category)
    {
        if (auth::id() !== 1) {
            return redirect('/categories')->with('flash', ['error' => 'Anda tidak memiliki izin untuk mengedit kategori.']);
        }

        $request->validate([
            'name' => 'required|string|max:255|unique:categories,name,' . $category->id,
        ]);

        $category->update($request->only('name'));
        return redirect('/categories')->with('flash', ['success' => 'Kategori berhasil diperbarui.']);
    }

    public function destroy(Category $category)
    {
        if (auth::id() !== 1) {
            return redirect('/categories')->with('flash', ['error' => 'Anda tidak memiliki izin untuk menghapus kategori.']);
        }

        if ($category->posts_count > 0) {
            return redirect('/categories')->with('flash', ['error' => 'Kategori ini tidak dapat dihapus karena sedang digunakan.']);
        }

        $category->delete();
        return redirect('/categories')->with('flash', ['success' => 'Kategori berhasil dihapus.']);
    }
}
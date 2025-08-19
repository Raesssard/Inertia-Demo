<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class PostController extends Controller
{
    public function index(Request $request)
    {
        $query = Post::with('category');

        // Filter berdasarkan search (judul)
        if ($request->search) {
            $query->where('title', 'like', "%{$request->search}%");
        }

        // Filter berdasarkan kategori
        if ($request->category_id) {
            $query->where('category_id', $request->category_id);
        }

        // Filter berdasarkan rentang tanggal
        if ($request->start_date) {
            $query->whereDate('created_at', '>=', $request->start_date);
        }
        if ($request->end_date) {
            $query->whereDate('created_at', '<=', $request->end_date);
        }

        // Sorting
        if ($request->sort_by === 'title') {
            $query->orderBy('title');
        } else {
            $query->latest();
        }

        $posts = $query->paginate(9)->withQueryString(); // withQueryString untuk mempertahankan parameter filter

        $categories = Category::all();

        return Inertia::render('Posts/Index', [
            'posts' => $posts,
            'categories' => $categories,
        ]);
    }

    public function show(Post $post)
    {
        return Inertia::render('Posts/Show', [
            'post' => $post->load('category'),
        ]);
    }

    public function create()
    {
        $categories = Category::all();
        return Inertia::render('Posts/Create', [
            'categories' => $categories,
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'category_id' => 'nullable|exists:categories,id',
            'image' => 'nullable|image|mimes:jpeg,jpg,png,webp|max:2048',
        ]);

        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image')->store('posts', 'public');
        }

        Post::create($data);
        return redirect('/posts')->with('flash', ['success' => 'Post berhasil dibuat.']);
    }

    public function edit(Post $post)
    {
        $categories = Category::all();
        return Inertia::render('Posts/Edit', [
            'post' => $post,
            'categories' => $categories,
        ]);
    }

    public function update(Request $request, Post $post)
    {
        $data = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'category_id' => 'nullable|exists:categories,id',
            'image' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
        ]);

        if ($request->hasFile('image')) {
            if ($post->image && Storage::disk('public')->exists($post->image)) {
                Storage::disk('public')->delete($post->image);
            }
            $data['image'] = $request->file('image')->store('posts', 'public');
        } else {
            unset($data['image']);
        }

        $post->update($data);
        return redirect()->route('posts.index')->with('flash', ['success' => 'Post berhasil diperbarui.']);
    }

    public function destroy(Post $post)
    {
        if ($post->image && Storage::disk('public')->exists($post->image)) {
            Storage::disk('public')->delete($post->image);
        }

        $post->delete();
        return redirect('/posts')->with('flash', ['success' => 'Post berhasil dihapus.']);
    }
}
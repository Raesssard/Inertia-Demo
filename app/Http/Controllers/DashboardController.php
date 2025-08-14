<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $totalPosts = Post::count();
        $totalUsers = User::count();

        $postsPerMonth = Post::selectRaw('DATE_FORMAT(created_at, "%M") as month, COUNT(*) as count')
            ->groupBy('month')
            ->orderByRaw('MIN(created_at)')
            ->get();

        return Inertia::render('Dashboard', [
            'totalPosts' => $totalPosts,
            'totalUsers' => $totalUsers,
            'postsPerMonth' => $postsPerMonth,
        ]);
    }
}


<?php

namespace App\Providers;

use Illuminate\Support\Facades\Vite;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\ServiceProvider;
use Inertia\Inertia;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Inertia::share([
            'flash' => function () {
                return [
                    'success' => Session::get('flash.success'),
                    'error' => Session::get('flash.error') ?? Session::get('error'),
                ];
            },
            'filters' => function () {
                $filters = request()->query();
                return $filters ?: request()->all() ?: [];
            },
        ]);

        Vite::prefetch(concurrency: 3);
    }
}
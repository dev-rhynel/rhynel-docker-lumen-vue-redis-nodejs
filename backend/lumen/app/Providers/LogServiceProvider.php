<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Log\LogManager;

class LogServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        $this->app->singleton('log', function ($app) {
            return new LogManager($app);
        });
    }
}

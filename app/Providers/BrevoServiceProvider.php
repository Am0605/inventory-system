<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Mail\MailManager;
use App\Mail\BrevoTransport;

class BrevoServiceProvider extends ServiceProvider
{
    public function register()
    {
        $this->app->afterResolving(MailManager::class, function (MailManager $manager) {
            $manager->extend('brevo', function ($config) {
                return new BrevoTransport(config('services.brevo.key'));
            });
        });
    }

    public function boot()
    {
        //
    }
}
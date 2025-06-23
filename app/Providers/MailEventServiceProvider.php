<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Mail\Events\MessageSending;
use Illuminate\Mail\Events\MessageSent;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\Log;

class MailEventServiceProvider extends ServiceProvider
{
    public function boot()
    {
        Event::listen(MessageSending::class, function (MessageSending $event) {
            Log::channel('mail')->info('Email Sending:', [
                'to' => $event->message->getTo(),
                'subject' => $event->message->getSubject(),
                'from' => $event->message->getFrom(),
            ]);
        });

        Event::listen(MessageSent::class, function (MessageSent $event) {
            Log::channel('mail')->info('Email Sent Successfully:', [
                'to' => $event->message->getTo(),
                'subject' => $event->message->getSubject(),
            ]);
        });
    }
}
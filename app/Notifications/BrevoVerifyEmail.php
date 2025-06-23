<?php

namespace App\Notifications;

use Illuminate\Auth\Notifications\VerifyEmail;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Support\Facades\Log;

class BrevoVerifyEmail extends VerifyEmail
{
    /**
     * Get the mail representation of the notification.
     */
    public function toMail(mixed $notifiable): MailMessage
    {
        $verificationUrl = $this->verificationUrl($notifiable);
        
        Log::info('Building verification email:', [
            'user_email' => $notifiable->email,
            'user_name' => $notifiable->name,
            'verification_url' => $verificationUrl
        ]);

        return (new MailMessage)
            ->subject('Verify Your Smart Inventory Account')
            ->view('emails.verify-email', [
                'user' => $notifiable,
                'verificationUrl' => $verificationUrl
            ]);
    }
}
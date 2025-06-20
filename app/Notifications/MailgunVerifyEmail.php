<?php

namespace App\Notifications;

use Illuminate\Auth\Notifications\VerifyEmail;
use Illuminate\Notifications\Messages\MailMessage;

class MailgunVerifyEmail extends VerifyEmail
{
    /**
     * Get the mail representation of the notification.
     */
    public function toMail(mixed $notifiable): MailMessage
    {
        $verificationUrl = $this->verificationUrl($notifiable);

        return (new MailMessage)
            ->subject('Verify Your Smart Inventory Account')
            ->greeting('Welcome to Smart Inventory System!')
            ->line('Thank you for signing up! We\'re excited to have you on board.')
            ->line('To get started, please verify your email address by clicking the button below:')
            ->action('Verify Email Address', $verificationUrl)
            ->line('This verification link will expire in 60 minutes for security purposes.')
            ->line('If you did not create an account, no further action is required.')
            ->line('If you\'re having trouble clicking the "Verify Email Address" button, copy and paste the URL below into your web browser:')
            ->line($verificationUrl)
            ->salutation('Best regards,')
            ->salutation('The Smart Inventory Team');
    }
}
<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

// Add this temporarily for debugging
Route::get('/debug-email', function () {
    try {
        // Log mail configuration
        Log::info('=== EMAIL DEBUG START ===');
        Log::info('Mail Config:', [
            'default' => config('mail.default'),
            'host' => config('mail.mailers.smtp.host'),
            'port' => config('mail.mailers.smtp.port'),
            'username' => config('mail.mailers.smtp.username'),
            'password_set' => !empty(config('mail.mailers.smtp.password')),
            'encryption' => config('mail.mailers.smtp.encryption'),
            'from_address' => config('mail.from.address'),
            'from_name' => config('mail.from.name'),
        ]);
        
        // Check if we can connect to SMTP server
        Log::info('Testing SMTP connection...');
        
        // Test basic email sending with more detailed logging
        Log::info('Attempting to send test email...');
        
        $emailSent = false;
        $transportError = null;
        
        try {
            Mail::send([], [], function ($message) {
                $message->to('adham8663@gmail.com')
                        ->subject('Debug Test Email - ' . now())
                        ->from(config('mail.from.address'), config('mail.from.name'))
                        ->html('<h1>Test Email</h1><p>This is a test email from Smart Inventory System sent at ' . now() . '</p>');
            });
            $emailSent = true;
            Log::info('Mail::send() completed without throwing exception');
        } catch (\Exception $mailException) {
            $transportError = $mailException->getMessage();
            Log::error('Mail::send() threw exception:', [
                'error' => $mailException->getMessage(),
                'file' => $mailException->getFile(),
                'line' => $mailException->getLine()
            ]);
        }
        
        // Also test with Swift Mailer transport directly
        try {
            $transport = app('mailer')->getSymfonyTransport();
            Log::info('Transport type:', ['transport' => get_class($transport)]);
            
            // Test transport
            if (method_exists($transport, 'start')) {
                $transport->start();
                Log::info('Transport started successfully');
            }
            
        } catch (\Exception $transportException) {
            Log::error('Transport error:', [
                'error' => $transportException->getMessage()
            ]);
        }
        
        return response()->json([
            'status' => $emailSent ? 'success' : 'partial',
            'message' => $emailSent ? 'Email sent successfully!' : 'Email may not have been sent',
            'transport_error' => $transportError,
            'config' => [
                'mailer' => config('mail.default'),
                'host' => config('mail.mailers.smtp.host'),
                'port' => config('mail.mailers.smtp.port'),
                'from' => config('mail.from.address'),
                'username' => config('mail.mailers.smtp.username'),
                'password_length' => strlen(config('mail.mailers.smtp.password')),
            ],
            'timestamp' => now(),
            'logs_location' => 'Check storage/logs/laravel.log for detailed logs'
        ]);
        
    } catch (\Exception $e) {
        Log::error('Email debug failed:', [
            'error' => $e->getMessage(),
            'trace' => $e->getTraceAsString()
        ]);
        
        return response()->json([
            'status' => 'error',
            'message' => $e->getMessage(),
            'line' => $e->getLine(),
            'file' => $e->getFile()
        ], 500);
    }
});

Route::get('/debug-queue', function () {
    Log::info('Queue Config:', [
        'default' => config('queue.default'),
        'connections' => array_keys(config('queue.connections')),

    ]);
    
    // Check if there are any jobs in the queue
    $queueJobs = DB::table('jobs')->count();
    $failedJobs = DB::table('failed_jobs')->count();
    
    return response()->json([
        'queue_driver' => config('queue.default'),
        'pending_jobs' => $queueJobs,
        'failed_jobs' => $failedJobs,
        'suggestion' => $queueJobs > 0 ? 'Run: php artisan queue:work' : 'No queued jobs'
    ]);
});

// New Brevo debug route
Route::get('/debug-brevo', function () {
    try {
        $apiKey = env('BREVO_API_KEY');
        
        if (!$apiKey) {
            return response()->json(['error' => 'BREVO_API_KEY not set']);
        }
        
        // Test Brevo API connection
        $client = new \GuzzleHttp\Client();
        $response = $client->get('https://api.brevo.com/v3/account', [
            'headers' => [
                'api-key' => $apiKey,
                'Content-Type' => 'application/json'
            ]
        ]);
        
        $account = json_decode($response->getBody(), true);
        
        return response()->json([
            'brevo_account' => [
                'email' => $account['email'] ?? 'Unknown',
                'plan' => $account['plan'] ?? 'Unknown',
                'credits' => $account['credits'] ?? 'Unknown',
            ],
            'smtp_allowed' => true
        ]);
        
    } catch (\Exception $e) {
        return response()->json([
            'error' => 'Brevo API Error: ' . $e->getMessage(),
            'suggestion' => 'Check your BREVO_API_KEY'
        ], 400);
    }
});

Route::get('/debug-brevo-api', function () {
    try {
        Log::info('=== BREVO API DEBUG START ===');
        
        $apiKey = config('services.brevo.key');
        
        Log::info('API Key check:', [
            'api_key_set' => !empty($apiKey),
            'api_key_length' => strlen($apiKey),
            'api_key_prefix' => substr($apiKey, 0, 10) . '...'
        ]);
        
        // Test API connection first
        $client = new \GuzzleHttp\Client();
        $accountResponse = $client->get('https://api.brevo.com/v3/account', [
            'headers' => [
                'api-key' => $apiKey,
                'Content-Type' => 'application/json'
            ]
        ]);
        
        $account = json_decode($accountResponse->getBody(), true);
        Log::info('Brevo account info:', $account);
        
        // Test email sending
        Log::info('Sending test email via Brevo API...');
        
        Mail::raw('This is a test email via Brevo API sent at ' . now(), function ($message) {
            $message->to('adham8663@gmail.com')
                    ->subject('Brevo API Test - ' . now())
                    ->from(config('mail.from.address'), config('mail.from.name'));
        });
        
        Log::info('Email sent successfully via Brevo API');
        
        return response()->json([
            'status' => 'success',
            'message' => 'Email sent via Brevo API',
            'account' => [
                'email' => $account['email'] ?? 'Unknown',
                'plan' => $account['plan'] ?? 'Unknown',
                'credits' => $account['credits'] ?? 'Unknown'
            ],
            'timestamp' => now()
        ]);
        
    } catch (\Exception $e) {
        Log::error('Brevo API debug failed:', [
            'error' => $e->getMessage(),
            'trace' => $e->getTraceAsString()
        ]);
        
        return response()->json([
            'status' => 'error',
            'message' => $e->getMessage(),
            'suggestion' => 'Check your BREVO_API_KEY and account status'
        ], 500);
    }
});

Route::get('/debug-env-mail', function () {
    return response()->json([
        'env_vars' => [
            'MAIL_MAILER' => env('MAIL_MAILER'),
            'MAIL_HOST' => env('MAIL_HOST'),
            'MAIL_PORT' => env('MAIL_PORT'),
            'MAIL_USERNAME' => env('MAIL_USERNAME'),
            'MAIL_PASSWORD' => env('MAIL_PASSWORD') ? 'SET (' . strlen(env('MAIL_PASSWORD')) . ' chars)' : 'NOT SET',
            'MAIL_ENCRYPTION' => env('MAIL_ENCRYPTION'),
            'MAIL_FROM_ADDRESS' => env('MAIL_FROM_ADDRESS'),
            'MAIL_FROM_NAME' => env('MAIL_FROM_NAME'),
        ],
        'config_cache' => [
            'mail.default' => config('mail.default'),
            'mail.from.address' => config('mail.from.address'),
        ]
    ]);
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';

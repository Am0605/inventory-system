<?php

namespace App\Mail;

use Symfony\Component\Mailer\Transport\AbstractTransport;
use Symfony\Component\Mailer\SentMessage;
use Symfony\Component\Mime\MessageConverter;
use Symfony\Component\Mime\Email;
use GuzzleHttp\Client;
use Illuminate\Support\Facades\Log;
use Psr\EventDispatcher\EventDispatcherInterface;
use Psr\Log\LoggerInterface;

class BrevoTransport extends AbstractTransport
{
    protected $apiKey;
    protected $client;

    public function __construct(string $apiKey, EventDispatcherInterface $dispatcher = null, LoggerInterface $logger = null)
    {
        parent::__construct($dispatcher, $logger);
        
        $this->apiKey = $apiKey;
        $this->client = new Client([
            'base_uri' => 'https://api.brevo.com/v3/',
            'timeout' => 30,
        ]);
    }

    protected function doSend(SentMessage $message): void
    {
        $email = MessageConverter::toEmail($message->getOriginalMessage());
        
        Log::info('Brevo API: Preparing email', [
            'subject' => $email->getSubject(),
            'from' => $email->getFrom()[0]->getAddress(),
            'to_count' => count($email->getTo())
        ]);
        
        // Prepare recipients
        $to = [];
        foreach ($email->getTo() as $recipient) {
            $recipientData = ['email' => $recipient->getAddress()];
            
            // Add name if available
            if ($recipient->getName()) {
                $recipientData['name'] = $recipient->getName();
            }
            
            $to[] = $recipientData;
        }
        
        // Prepare sender
        $from = $email->getFrom()[0];
        $sender = [
            'email' => $from->getAddress(),
            'name' => $from->getName() ?: 'Smart Inventory System'
        ];
        
        // Prepare email data
        $emailData = [
            'sender' => $sender,
            'to' => $to,
            'subject' => $email->getSubject(),
        ];
        
        // Add content
        if ($email->getHtmlBody()) {
            $emailData['htmlContent'] = $email->getHtmlBody();
        }
        
        if ($email->getTextBody()) {
            $emailData['textContent'] = $email->getTextBody();
        }
        
        // If no HTML content but we have text, use text as HTML
        if (!isset($emailData['htmlContent']) && isset($emailData['textContent'])) {
            $emailData['htmlContent'] = nl2br(htmlspecialchars($emailData['textContent']));
        }
        
        Log::info('Brevo API: Sending email data', $emailData);
        
        try {
            $response = $this->client->post('smtp/email', [
                'headers' => [
                    'api-key' => $this->apiKey,
                    'Content-Type' => 'application/json',
                    'Accept' => 'application/json',
                ],
                'json' => $emailData
            ]);
            
            $responseData = json_decode($response->getBody(), true);
            
            Log::info('Brevo API: Email sent successfully', [
                'message_id' => $responseData['messageId'] ?? 'unknown',
                'response' => $responseData
            ]);
            
        } catch (\GuzzleHttp\Exception\ClientException $e) {
            $errorResponse = $e->getResponse();
            $errorBody = $errorResponse ? $errorResponse->getBody()->getContents() : 'Unknown error';
            
            Log::error('Brevo API: Client error', [
                'status_code' => $e->getCode(),
                'error_body' => $errorBody,
                'email_data' => $emailData
            ]);
            
            throw new \Exception('Brevo API Client Error: ' . $errorBody);
            
        } catch (\GuzzleHttp\Exception\ServerException $e) {
            $errorResponse = $e->getResponse();
            $errorBody = $errorResponse ? $errorResponse->getBody()->getContents() : 'Unknown server error';
            
            Log::error('Brevo API: Server error', [
                'status_code' => $e->getCode(),
                'error_body' => $errorBody
            ]);
            
            throw new \Exception('Brevo API Server Error: ' . $errorBody);
            
        } catch (\Exception $e) {
            Log::error('Brevo API: General error', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            throw new \Exception('Brevo API Error: ' . $e->getMessage());
        }
    }

    public function __toString(): string
    {
        return 'brevo';
    }
}
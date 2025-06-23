{{-- filepath: c:\Users\Amran\Herd\inventory-system\resources\views\emails\verify-email.blade.php --}}
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Verify Your Email - Smart Inventory System</title>
    <style>
        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            line-height: 1.6; 
            color: #333; 
            margin: 0; 
            padding: 0; 
            background-color: #f8fafc;
        }
        .container { 
            max-width: 600px; 
            margin: 0 auto; 
            background-color: white;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header { 
            background: linear-gradient(135deg, #3B82F6, #6366F1); 
            color: white; 
            padding: 40px 30px; 
            text-align: center; 
        }
        .logo {
            display: inline-flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 20px;
        }
        .logo-icon {
            width: 40px;
            height: 40px;
            background: rgba(255, 255, 255, 0.2);
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .content { 
            padding: 40px 30px; 
        }
        .button { 
            display: inline-block; 
            background: #3B82F6; 
            color: white; 
            padding: 15px 30px; 
            text-decoration: none; 
            border-radius: 8px; 
            margin: 25px 0;
            font-weight: 600;
            transition: background-color 0.3s;
        }
        .button:hover {
            background: #2563EB;
        }
        .footer { 
            background: #f8fafc; 
            padding: 30px; 
            text-align: center; 
            font-size: 14px; 
            color: #6b7280; 
            border-top: 1px solid #e5e7eb;
        }
        .divider {
            border-top: 1px solid #e5e7eb;
            margin: 30px 0;
        }
        .url-box {
            background: #f8fafc;
            padding: 15px;
            border-radius: 6px;
            word-break: break-all;
            font-size: 14px;
            color: #6b7280;
            margin-top: 20px;
        }
        .warning-box {
            background: #fef3cd; 
            border: 1px solid #f59e0b; 
            border-radius: 6px; 
            padding: 15px; 
            margin: 20px 0;
        }
        .warning-text {
            margin: 0; 
            color: #92400e; 
            font-size: 14px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">
                <div class="logo-icon">
                    📦
                </div>
                <h2 style="margin: 0; font-size: 24px;">Smart Inventory System</h2>
            </div>
            <h1 style="margin: 0; font-size: 28px; font-weight: 700;">Welcome Aboard!</h1>
        </div>
        
        <div class="content">
            <h2 style="color: #1f2937; margin-top: 0;">Hello {{ $user->name ?? 'there' }}! 👋</h2>
            
            <p style="font-size: 16px; margin-bottom: 20px;">
                Thank you for signing up for Smart Inventory System! We're thrilled to have you join our community of businesses streamlining their inventory management.
            </p>
            
            <p style="font-size: 16px; margin-bottom: 20px;">
                To get started and access all the powerful features of our platform, please verify your email address by clicking the button below:
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
                <a href="{{ $verificationUrl }}" class="button">✅ Verify Email Address</a>
            </div>
            
            <div class="warning-box">
                <p class="warning-text">
                    ⏰ <strong>Important:</strong> This verification link will expire in 60 minutes for security purposes.
                </p>
            </div>
            
            <div class="divider"></div>
            
            <h3 style="color: #1f2937;">What's Next?</h3>
            <ul style="color: #4b5563;">
                <li>Complete your profile setup</li>
                <li>Add your first inventory items</li>
                <li>Explore our dashboard and analytics</li>
                <li>Set up smart alerts for your business</li>
            </ul>
            
            <div class="divider"></div>
            
            <p style="font-size: 14px; color: #6b7280;">
                If you're having trouble clicking the button above, copy and paste the following URL into your web browser:
            </p>
            <div class="url-box">{{ $verificationUrl }}</div>
            
            <p style="font-size: 14px; color: #6b7280; margin-top: 30px;">
                If you did not create an account with Smart Inventory System, no further action is required, and you can safely ignore this email.
            </p>
        </div>
        
        <div class="footer">
            <p style="margin: 0 0 10px 0; font-weight: 600;">Smart Inventory System</p>
            <p style="margin: 0; font-size: 12px;">
                &copy; {{ date('Y') }} Smart Inventory System. All rights reserved.
            </p>
            <p style="margin: 10px 0 0 0; font-size: 12px;">
                Need help? Contact us at <a href="mailto:support@smartinventory.com" style="color: #3B82F6;">support@smartinventory.com</a>
            </p>
        </div>
    </div>
</body>
</html>